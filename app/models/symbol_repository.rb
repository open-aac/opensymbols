require 'typhoeus'

class SymbolRepository < ApplicationRecord
  include SecureSerialize

  has_many :repository_modifiers

  secure_serialize :settings
  before_save :generate_defaults

  EXPECTED_LOCALES = ['en', 'ar', 'cs', 'da', 'de', 'es', 'fi', 'fr', 'he', 'hu', 'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt', 'ru', 'sv', 'tr', 'vi', 'zh']

  def generate_defaults
    self.settings ||= {}
    self.settings['active'] = true if self.settings['active'] == nil
    self.settings['protected'] ||= false
    self.settings['name'] ||= 'Unnamed Repository'
    self.settings['n_symbols'] = PictureSymbol.where(repo_key: self.repo_key).count if self.repo_key
    self.settings['n_protected_symbols'] = self.settings['n_symbols'] if self.settings['protected']
    self.settings['n_symbols'] = 0 if self.settings['protected']
  end

  def self.retrieve_from_manifest(key, skip_update=false)
    repo_attributes, symbols = S3Bucket.retrieve_from_manifest(key)
    repo = SymbolRepository.find_or_initialize_by(:repo_key => key)
    repo.settings ||= {}
    repo.settings['active'] = true
    repo.settings['name'] = repo_attributes['name']
    repo.settings['url'] = repo_attributes['url']
    repo.settings['protected'] = repo_attributes['protected']
    repo.settings['repository_type'] = 'local'
    repo.settings['default_attribution'] = repo_attributes['default_attribution']
    repo.save
    puts "repo #{repo.id ? 'found' : 'created'} - #{symbols.length} symbols found"
    symbols.each_with_index do |symbol, idx|
      puts idx if idx % 100 == 0 && skip_update
      PictureSymbol.generate_for_repo(repo, symbol, skip_update)
    end
    repo.reload
    repo.settings['n_symbols'] = PictureSymbol.where(repo_key: repo.repo_key).count
    repo.save
    repo.settings['n_symbols']
  end

  def disable_ids(ids)
    raise "not implemented"
  #   puts "looking for #{ids.length} records"
  #   symbols = self.picture_symbols(:id => ids)
  #   puts "found #{symbols.count} records"
  #   symbols.each do |s|
  #     puts s.id
  #     s.enabled = false
  #     s.save
  #   end
  #   self.n_symbols = PictureSymbol.all(:enabled => true, :symbol_repository_id => self.id).count
  #   self.save
  # end
  end

  def missing_core_words
    lists = self.class.core_lists
    res = {}
    mods = {}
    self.repository_modifiers.each{|mod| mods[mod.locale] = mod }
    (self.settings['defaults'] || []).each do |locale, defaults|
      mod = RepositoryModifier.find_for(self, locale)
      mods[mod.locale] = mod
    end
    lists.each do |locale, list|
      localized = (mods[locale] || self).settings['defaults'] || {}
      res[locale] = []
      list.each do |word|
        res[locale] << word unless localized[word]
      end
    end
    res
  end

  def default_core_words
    lists = self.class.core_lists
    res = {}
    mods = {}
    self.repository_modifiers.each{|mod| mods[mod.locale] = mod }
    (self.settings['defaults'] || []).each do |locale, defaults|
      mod = RepositoryModifier.find_for(self, locale)
      mods[mod.locale] = mod
    end
    lists.each do |locale, list|
      localized = (mods[locale] || self).settings['defaults'] || {}
      res[locale] = {}
      list.each do |word|
        res[locale][word] = localized[word] if localized[word]
      end
    end
    res
  end

  def assert_translations(coughdrop_access_token)
    repo = self
    PictureSymbol.where(repo_key: repo.repo_key).find_in_batches(batch_size: 50) do |batch|
      words = []
      recs = []
      batch.each do |word|
        words << word.settings['name']
        recs << word
      end
      puts "#{words[0]} .. #{words[-1]} "
      SymbolRepository::EXPECTED_LOCALES.each do |loc|
        next if loc == 'en'
        lookups = []
        recs.each do |word|
          trans = (word.settings['locales'] || {})[loc] || {}
          if ((word.settings['batch_translations'] || {})[loc] || 0) < 6.months.ago.to_i
            if !trans['name'] && word.settings['name'] && word.settings['name'].length > 0
              lookups << word.settings['name']
            end
            if !trans['description'] && word.settings['description'] && word.settings['description'].length > 0
              lookups << word.settings['description']
            end
          end
        end
        puts "  #{loc} - adding #{lookups.length}..."
        json = nil
        res = nil
        if lookups.length > 0
          res = Typhoeus.post("#{ENV['COUGHDROP_HOST']}/api/v1/users/self/translate", 
            headers: {'Content-Type' => 'application/json'},
            body: {
              access_token: coughdrop_access_token,
              words: lookups, 
              source_lang: 'en', 
              destination_lang: loc
            }.to_json)
          json = JSON.parse(res.body) rescue nil
          if json
            puts "    found #{(json['translations'] || {}).keys.length}"
            recs.each do |word|
              word.settings['locales'] ||= {}
              word.settings['batch_translations'] ||= {}
              word.settings['batch_translations'][loc] = Time.now.to_i
              word.instance_variable_set('@changed_locale', true)
              if json['translations'] && (json['translations'][word.settings['name']] || json['translations'][word.settings['description']])
                word.settings['locales'][loc] ||= {}
                word.settings['locales'][loc]['name'] = json['translations'][word.settings['name']] if json['translations'][word.settings['name']]
                word.settings['locales'][loc]['description'] = json['translations'][word.settings['description']] if json['translations'][word.settings['description']]
              end
            end
          else
            puts "    **ERROR** #{res && res.code}"
          end
        end
      end
      recs.each{|word| 
        word.save if word.instance_variable_get('@changed_locale')
        word.instance_variable_set('@changed_locale', false)
      }
    end
  end

  def self.core_lists
    @@core_lists ||= nil
    return @@core_lists if @@core_lists
    json = JSON.parse(File.read('./lib/core_lists.json')) rescue nil
    if json
      json.each do |locale, list|
        json[locale] = list.map{|i| i.downcase }
      end
      @@core_lists = json
    end
    @@core_lists ||= {}
    @@core_lists
  end

  def self.ingest(json)
    json.each do |record|
      repo = SymbolRepository.find_or_initialize_by(repo_key: record['repo_key'])
      repo.settings ||= {}
      repo.settings['name'] = record['name']
      repo.settings['active'] = !!record['active']
      repo.settings['protected'] = !!record['protected']
      repo.settings['url'] = record['url']
      repo.settings['description'] = record['description']
      repo.repo_key = record['repo_key']
      repo.settings['repository_type'] = record['repository_type']
      repo.settings['default_attribution'] = record['default_attribution']
      repo.save!
    end
  end  
  
  def self.ingest_all(url)
    res = Typhoeus.get(url)
    json = JSON.parse(res.body)
    ExternalSource.ingest(json['source'])
    # nothing worth ingesting for requests
    SymbolRepository.ingest(json['repo'])
    PictureSymbol.ingest(json['symbol'])
    {
      source: [ExternalSource.count, json['source'].length],
      repo: [SymbolRepository.count, json['repo'].length],
      symbol: [PictureSymbol.count, json['symbol'].length]
    }
  end
end
