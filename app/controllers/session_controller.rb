class SessionController < ApplicationController
  def token
    if params['secret'].match(/^temp/)
      token = params['secret']
      check = ExternalSource.confirm_user_token(token.sub(/^temp:/, 'user:'))
      if check[:valid]
        user_id = params['user_id'] || Time.now.to_i.to_s
        access_token = ExternalSource.user_token(user_id).sub(/^user:/, 'temp:')
        render json: {access_token: access_token, expires: 24.hours.from_now.utc.iso8601}
      else
        return api_error 400, {error: "invalid token"}
      end
    else
      source = ExternalSource.find_by(token: params['secret'])
      if source
        user_id = params['user_id'] || Time.now.to_i.to_s
        render json: {access_token: source.access_token(Digest::MD5.hexdigest(user_id)[0, 10]), expires: 24.hours.from_now.utc.iso8601}
      else
        return api_error 400, {error: "invalid token"}
      end
    end
  end

  def coughdrop_auth
    if params['id'] == 'check'
      if ENV['COUGHDROP_HOST'] && ENV['COUGHDROP_CLIENT_ID']
        redirect_to "#{ENV['COUGHDROP_HOST']}/oauth2/token?client_id=#{ENV['COUGHDROP_CLIENT_ID']}&scope=read_profile:basic_supervision&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
      else
        render text: "CoughDrop not configured"
      end
    elsif params['id'] == 'confirm'
      if !ENV['COUGHDROP_CLIENT_ID'] || !ENV['COUGHDROP_CLIENT_SECRET']
        api_error 400, {error: "CoughDrop not configured"}
      elsif params['code']
        res = Typhoeus.post("#{ENV['COUGHDROP_HOST']}/oauth2/token", body: {
          client_id: ENV['COUGHDROP_CLIENT_ID'],
          client_secret: ENV['COUGHDROP_CLIENT_SECRET'],
          code: params['code']
        })
        json = JSON.parse(res.body) rescue nil
        return api_error(400, {error: "Invalid response"}) unless json
        token = json
        res = Typhoeus.get("#{ENV['COUGHDROP_HOST']}/api/v1/users/self?access_token=#{token['access_token']}")
        json = JSON.parse(res.body) rescue nil
        return api_error(400, {error: "Error retrieving user details", src: res.body}) unless json && json['user']
        user = json['user']
        auth_token = nil
        if user['admin'] || (user['permissions'] && user['permissions']['admin_support_actions'])
          auth_token = ExternalSource.user_token(token['user_name'])
        end
        render json: {token: auth_token}
      else
        api_error 400, {error: "Code missing from response"}
      end
    end
  end
end
