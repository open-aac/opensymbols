class ExternalSource < ApplicationRecord
  include SecureSerialize

  secure_serialize :settings
  before_save :generate_defaults

  def generate_defaults
    self.settings ||= {}
    self.token ||= GoSecure.nonce('external_source_token')
  end

  def user_id(str)
    "#{self.id}-#{str}"
  end

  def self.generate(name)
    source = ExternalSource.new
    source.settings = {}
    source.settings['name'] = name
    source.save!
    source
  end

  def self.ingest(json)
    json.each do |record|
      source = ExternalSource.find_or_initialize_by(token: record['token'])
      source.settings ||= {}
      source.settings['name'] = record['name']
      source.save!
    end
  end    

  def self.user_token(user_name)
    str = "#{user_name}:#{Time.now.to_i}:#{GoSecure.nonce('user_token')}:"
    str += GoSecure.sha512(str, 'user_token_sha')
    str
  end

  def self.confirm_user_token(token)
    user_name, timestamp, nonce, sha = token.split(/:/)
    if timestamp.to_i > 36.hours.ago.to_i && sha == GoSecure.sha512("#{user_name}:#{timestamp}:#{nonce}:", 'user_token_sha')
      res = {valid: true, user_name: user_name}
      if timestamp.to_i < 6.hours.ago.to_i
        res[:refresh_token] = user_token(user_name)
      end
      res
    else
      {valid: false}
    end
  end
end
