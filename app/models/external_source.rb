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
  
  def throttle_level
    return 5 if self.settings['full_access']
    return 2 if self.settings['approved']
    return 1
  end

  def access_token(user_id)
    level = self.throttle_level.to_s
    str = "token::#{self.id}-#{level}:#{user_id}:#{Time.now.to_i}:#{GoSecure.nonce('access_token')}:"
    str += GoSecure.sha512(str, 'access_token_sha')
    str
  end
  
  def self.confirm_token(token)
    type, token = token.split(/::/) if token.match(/::/)
    res = {valid: false}
    parts = (token || '').split(/:/)
    source = ExternalSource.find_by(token: parts[0])
    if source && source.settings['global_token']
      res[:valid] = true
      res[:full_access] = !!(source.settings['full_access'] && source.settings['approved'])
      if parts[1]
        res[:allowed_repos] = parts[1].split(/,/)
      end
    else
      source_id, user_id, timestamp, nonce, sha = token.split(/:/)
      source_id, level = source_id.split(/-/)
      source = ExternalSource.find_by(id: source_id)
      if user_id && timestamp && nonce && sha == GoSecure.sha512("token::#{source_id}-#{level}:#{user_id}:#{timestamp}:#{nonce}:", 'access_token_sha') && source && source.throttle_level >= level.to_i
        if timestamp.to_i > 36.hours.ago.to_i
          res[:valid] = true
        else
          res[:expired] = true
        end
      end
    end
    return res
  end

  def self.user_token(user_name)
    str = "user::#{user_name}:#{Time.now.to_i}:#{GoSecure.nonce('user_token')}:"
    str += GoSecure.sha512(str, 'user_token_sha')
    str
  end

  def self.confirm_user_token(token)
    type, token = token.split(/::/) if token.match(/::/)
    user_name, timestamp, nonce, sha = token.split(/:/)
    if type == 'user' && user_name && timestamp && nonce && sha == GoSecure.sha512("user::#{user_name}:#{timestamp}:#{nonce}:", 'user_token_sha')
      if timestamp.to_i > 36.hours.ago.to_i
        res = {valid: true, user_name: user_name}
      else
        res = {expired: true}
      end
      res
    else
      {valid: false}
    end
  end
end
