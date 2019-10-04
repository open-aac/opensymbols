class PictureSymbol < ApplicationRecord
  include SecureSerialize

  secure_serialize :settings
  before_save :generate_defaults
  after_save :submit_to_external_index

  def generate_defaults
    self.random = rand(99999999)
    self.settings ||= {}
    self.settings['locales'] ||= {}
    self.generate_search_string
    self.generate_use_counts
  end

  def submit_to_external_index
    locales = ['en']
    locales.each do |locale|
      if ElasticSearcher.enabled?
        if self.settings['enabled'] == false
          ElasticSearcher.remove_symbol(self, locale)
        else
          ElasticSearcher.index_symbol(self, locale)
        end
      end
    end
  end

  def generate_search_string
    locales = ['en']
    self.settings['locales'] ||= {}
    locales.each do |locale|
      localized = self.settings['locales'][locale] || {}
      uses = (localized['uses'] || {}).map{|keyword, list| [keyword, list.length] }.sort_by{|keyword, count| count }.map(&:first)
      uses += (localized['boosts'] || {}).keys
      recommendations = (localized['recommendations'] || {}).map{|keyword, list| [keyword, list.length] }.sort_by{|keyword, count| count }.map(&:first)
      name = localized['name'] || self.settings['name']
      description = localized['description'] || self.settings['description']
      localized['search_string'] = ("#{name} - #{description || ""}".downcase.sub(/^to\s/, '') + ", "  + uses.join(", ") + ", " + recommendations.join(" ")).strip
      localized['search_string'] = localized['search_string'].gsub(/[\.\(\)\/]/, '')
      self.settings['locales'][locale] = localized
    end
  end

  def generate_use_counts
    locales = ['en']
    self.settings['locales'] ||= {}
    locales.each do |locale|
      localized = self.settings['locales'][locale] || {}
      localized['use_scores'] = {}
      localized['uses'] ||= {}
      localized['boosts'] ||= {}
      localized['recommendations'] ||= {}
      (localized['uses'].keys | localized['recommendations'].keys | localized['boosts'].keys).each do |q|
        q = q.gsub(/\./, '')
        next if q.scan(/\s+/).length > 3
        uses = ((localized['uses'] || {})[q] || []).length
        recommendations = ((localized['recommendations'] || {})[q] || []).length
        use_score = uses + (recommendations * 4)
        use_score = Math.log(use_score.to_f + 0.1, 4).ceil
        if localized['boosts'][q]
          use_score += localized['boosts'][q]
        end
        localized['use_scores'][q] = use_score
      end
      self.settings['locales'][locale] = localized
      self.settings['rnd'] = rand(999)
    end
  end

  def set_as_default(keyword, locale)
    keyword = keyword.downcase
    symbol = self
    repo = SymbolRepository.find_by(repo_key: self.repo_key)
    if symbol && repo
      repo.settings['defaults'] ||= {}
      repo.settings['defaults'][locale] ||= {}
      if keyword.match(/^del:/)
        repo.settings['defaults'][locale].delete(keyword.sub(/^del:/, ''))
      else
        repo.settings['defaults'][locale][keyword] = symbol_key
      end
      repo.save!
      symbol.boost(keyword, locale, 5)
    end
  end

  def locale_settings
    repo = SymbolRepository.find_by(repo_key: self.repo_key)
    res = {}
    (self.settings['locales'] || {}).each do |locale, localized|
      res[locale] = {}.merge(localized)
      if repo && repo.settings && repo.settings['defaults'] && repo.settings['defaults'][locale]
        res[locale]['defaults'] = repo.settings['defaults'][locale].select{|keyword, symbol_key| symbol_key == self.symbol_key}.map(&:first)
      end
    end
    res
  end
  
  def boost_emoji
    res = false
    if self.settings && self.settings['image_url'] && self.settings['image_url'].match(/twemoji/)
      begin
        str = self.settings['image_url'].split(/\//)[-1].split(/\./)[0]
        self.settings['emoji'] = str
        self.boost(str, 'en')
        str = str.split(/-/).map{|s| s.hex }
        code = str.pack("U*")
        self.boost(code, 'en')
        self.b
        res = true
      rescue
      end
    end
    res
  end

  def boost(keyword, locale, factor=nil)
    keyword = keyword.downcase
    factor ||= 3
    symbol = self
    if symbol
      localized = symbol.settings['locales'][locale] || {}
      localized['boosts'] ||= {}
      if keyword.match(/^del:/)
        localized['boosts'].delete(keyword.sub(/^del:/, ''))
      else
        localized['boosts'][keyword] = factor
      end
      symbol.settings['locales'][locale] = localized
      symbol.generate_use_counts
      symbol.save
    end
    symbol
  end

  def used_for_keyword(keyword, locale, user_id)
    keyword = keyword.downcase
    localized = self.settings['locales'][locale] || {}
    localized['uses'] ||= {}
    localized['uses'][keyword] = ((localized['uses'][keyword] || []) << user_id.to_s).uniq
    self.settings['locales'][locale] = localized
    self.settings['rnd'] = rand(999)
    self.save
  end

  def recommended_for_keyword(keyword, locale, user_id)
    keyword = keyword.downcase
    localized = self.settings['locales'][locale] || {}
    localized['recommendations'] ||= {}
    localized['recommendations'][keyword] = ((localized['recommendations'][keyword] || []) << id.to_s).uniq
    self.settings['locales'][locale] = localized
    self.settings['rnd'] = rand(999)
    self.save
  end

  def self.search(q, locale='en', safe_search=true, allow_protected=false, protected_repos=nil)
    q = q.to_s.downcase
    repo_filter = nil
    if q.match(/repo:[\w_-]+/)
      match = q.match(/repo:([\w_-]+)/)
      repo_filter = match && match[1]
      q = q.sub(/repo:([\w_-]+)/, '')
    end
    # TODO: https://gist.github.com/BrianTheCoder/217158
    if ElasticSearcher.enabled?
      res = ElasticSearcher.search_symbols(q, locale, {
          repo_filter: repo_filter, 
          safe_search: safe_search, 
          allow_protected: allow_protected,
          protected_repos: protected_repos || []
      })
  
      bucket = ENV['S3_BUCKET']
      cdn = ENV['S3_CDN']
      if bucket && cdn
        res = res.map do |sym|
          if sym['image_url'].match(/^https:\/\/#{bucket}\.s3\.amazonaws\.com\//) && cdn
            sym['image_url'] = sym['image_url'].sub(/^https:\/\/#{bucket}\.s3\.amazonaws\.com\//, cdn + "/")
          elsif sym['image_url'].match(/^https:\/\/s3\.amazonaws\.com\/#{bucket}\//) && cdn
            sym['image_url']= sym['image_url'].sub(/^https:\/\/s3\.amazonaws\.com\/#{bucket}\//, cdn + "/")
          end
          sym
        end
      end
    else
      raise "elastic search required"
      # results = PictureSymbol.where(:search_string.like => "%#{q.to_s}%", :enabled => true, :limit => 250, :order => random)
      # if repo_filter
      #   results = results.all(:repo_key => repo_filter)
      # end
      # results = results.select{|s| s.search_string.index(/\b#{q}\w*\b/) }
      # results = results.select{|s| s.safe_result? }
      # results = results.select{|s| allow_protected || !s.protected_symbol }
      # results = results.sort_by do |s|
      #   use_score = (s.settings['use_scores'] || {})[q] || 0
      #   [0 - use_score, (s.search_string.index(/\b#{q}\b/) ? 0 : 1), s.search_string.index(/\b#{q}\b/) || 9999, s.search_string.index(q) || 9999, s.search_string.length] 
      # end
      # results[0,50].map(&:as_json)
    end
  end

  def self.generate_for_repo(repo, data, skip_update=false)
    repo_key = repo.repo_key
    fn = data['filename']
    symbol_key = PictureSymbol.keyify(data['name'], fn)
    symbol = PictureSymbol.find_or_initialize_by(:repo_key => repo_key, :symbol_key => symbol_key)
    locale = symbol['locale'] || 'en'
    already_processed = !!symbol.id
    return if already_processed && skip_update
    symbol.settings ||= {}
    symbol.settings['image_url'] = data['path'] ? "/#{data['path']}" : "/libraries/#{repo.repo_key}/#{data['filename']}"
    symbol.settings['name'] = data['name']
    symbol.settings['enabled'] = true unless data['enabled'] == false
    symbol.settings['file_extension'] = data['extension']
    symbol.settings['license'] = data['attribution']['license']
    symbol.settings['license_url'] = data['attribution']['license_url']
    symbol.settings['protected_symbol'] = true if data['protected'] || repo.settings['protected']
    symbol.settings['author'] = data['attribution']['author_name']
    symbol.settings['author_url'] = data['attribution']['author_url']
    symbol.settings['source_url'] = data['source_url']
    symbol.settings['description'] = data['description']
    symbol.settings['locales'] ||= {}
    symbol.settings['locales'][locale] ||= {}
    symbol.settings['locales'][locale]['name'] = data['name']
    symbol.settings['locales'][locale]['description'] = data['description']
    symbol.save
    if !already_processed
      (data['default_words'] || []).each do |word|
        symbol.set_as_default(word, locale)
      end
    end
    puts symbol.obj_json.to_json
    symbol
  end

  def mark_unsafe!(unsafe=true)
    # TODO: add to UI
    self.settings['unsafe_result'] = !!unsafe
    self.save
  end

  def safe_result?
    !self.settings['unsafe_result']
  end

  def full_image_url
    return nil unless self.settings['image_url']
    url = self.settings['image_url']
    bucket = ENV['S3_BUCKET']
    cdn = ENV['S3_CDN']
    if url.match(/^\//)
      url = "https://s3.amazonaws.com/#{bucket}#{url}"
    end
    if cdn
      if url.match(/^https:\/\/#{bucket}\.s3\.amazonaws\.com\//) && cdn
        url = url.sub(/^https:\/\/#{bucket}\.s3\.amazonaws\.com\//, cdn + "/")
      elsif url.match(/^https:\/\/s3\.amazonaws\.com\/#{bucket}\//) && cdn
        url= url.sub(/^https:\/\/s3\.amazonaws\.com\/#{bucket}\//, cdn + "/")
      end
    end
    url
  end

  def obj_json(verbose=false, locale='en')
    localized = self.settings['locales'][locale] || {}
    res = {
      :id => self.id,
      :symbol_key => self.symbol_key,
      :name => localized['name'] || self.settings['name'],
      :locale => locale,
      :license => self.settings['license'],
      :license_url => self.settings['license_url'],
      :enabled => self.settings['enabled'],
      :author => self.settings['author'],
      :author_url => self.settings['author_url'],
      :source_url => self.settings['source_url'],
      :repo_key => self.repo_key,
      :protected_symbol => !!self.settings['protected_symbol'],
      :extension => self.settings['file_extension'],
      :image_url => self.full_image_url,
      :search_string => localized['search_string'] || self.settings['search_string'],
      :unsafe_result => !self.safe_result?,
      :_href => "/api/v1/symbols/#{self.repo_key}/#{self.symbol_key}?id=#{self.id}",
      :details_url => "/symbols/#{self.repo_key}/#{self.symbol_key}?id=#{self.id}"
    }  
    if verbose
      res[:use_scores] = localized['use_scores'] || {}
      res[:use_scores] = res[:use_scores].slice(*res[:use_scores].keys.select{|k| k.strip.length > 0 })
    end  
    res
  end

  def self.keyify(name, filename)
    res = URI.escape(name.downcase.gsub(/[^a-z0-9]+/, '-')).sub(/^-/, '').sub(/-$/, '')
    "#{res}-#{Digest::MD5.hexdigest(filename)[0, 8]}"
  end

  def self.max_count
    @@max ||= PictureSymbol.count
  end

  def self.ingest(json)
    founds = {}
    json.each do |record|
      fn = record['image_url'].split(/\//).pop
      symbol_key = PictureSymbol.keyify(record['name'], fn)
      symbol = PictureSymbol.find_or_initialize_by(symbol_key: symbol_key, repo_key: record['repo_key'])
      if founds[symbol.id]
        puts symbol_key
        puts founds[symbol.id]
        puts JSON.pretty_generate(record)
        raise "duplicate symbol ingested!"
      end
      symbol.settings ||= {}
      symbol.settings['enabled'] = record['enabled'] == nil ? true : !!record['enabled']
      symbol.settings['protected_symbol'] = record['protected'] == nil ? true : !!record['protected']
      symbol.settings['unsafe_result'] = !!(record['settings'] && record['settings']['unsafe_result'])

      ['image_url', 'license', 'license_url', 'author', 'author_url', 'source_url', 'name', 'file_extension', 'description', 'search_string'].each do |key|
        symbol.settings[key] = record[key]
      end
      ['uses', 'boosts', 'recommendations'].each do |setting|
        symbol.settings['locales'] ||= {'en' => {}}
        if record['settings'] && record['settings'][setting]
          symbol.settings['locales']['en'][setting] = record['settings'][setting]
        end
      end
      symbol.settings = {}.merge(symbol.settings)
      symbol.save!
      founds[symbol.id] = symbol.settings['image_url']
    end    
  end
end
