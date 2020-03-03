class RepositoryModifier < ApplicationRecord
  include SecureSerialize

  belongs_to :symbol_repository

  secure_serialize :settings
  before_save :generate_defaults

  def generate_defaults
    self.settings ||= {}
    self.settings['defaults'] ||= {}
    self.repo_key = self.symbol_repository.repo_key
    true
  end

  def self.find_for(repo, locale)
    modifier = RepositoryModifier.find_or_create_by(symbol_repository_id: repo.id, locale: locale)
    if repo.settings['defaults'] && repo.settings['defaults'][locale]
      repo.settings['defaults'][locale].each do |keyword, symbol_key|
        modifier.settings['defaults'][keyword] ||= symbol_key
      end
      repo.settings['defaults'].delete(locale)
      repo.save
      modifier.save
    end
    modifier
  end

  def clear_extras
    words = {}
    (SymbolRepository.core_lists[self.locale] || []).each{|w| w && (words[w.downcase] = true) }
    self.settings['defaults'].each do |keyword, symbol|
      if !keyword || !words[keyword.downcase]
        self.settings['defaults'].delete(keyword)
      end
    end
    self.save
  end

  def set_as_default(symbol, keyword)
    self.settings['defaults'] ||= {}
    self.settings['defaults']
    if keyword.match(/^del:/)
      self.settings['defaults'].delete(keyword.sub(/^del:/, ''))
    else
      self.settings['defaults'][keyword] = symbol.symbol_key
    end
    self.save!
  end
end
