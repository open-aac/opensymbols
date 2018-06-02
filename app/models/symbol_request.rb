class SymbolRequest < ApplicationRecord
  include SecureSerialize

  secure_serialize :settings
  before_save :generate_defaults

  def generate_defaults
    self.settings ||= {}
    self.settings['history'] ||= {}
    self.settings['n_votes'] = (self.settings['history']['comments'] || []).length
  end

  def self.add(name, text, user_id=nil)
    req = SymbolRequest.find_or_create_by(name: name, locale: 'en')
    req.add_comment(text, user_id)
  end

  def add_comment(text, user_id=nil)
    self.settings['history'] ||= {}
    self.settings['history']['comments'] ||= []
    self.settings['history']['comments'] << {
      'user_id' => user_id,
      'text' => text,
      'timestamp' => Time.now.iso8601
    }
    self.save
  end
  
  def self.ingest(json)
    json.each do |record|
      req = SymbolRequest.new
      req.settings = {}
      req.settings['n_votes'] = record['n_votes']
      req.settings['history'] = record['history']
      req.save!
    end
  end    
end
