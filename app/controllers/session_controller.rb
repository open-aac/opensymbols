class SessionController < ApplicationController
  def coughdrop_auth
    if params['id'] == 'check'
      if ENV['COUGHDROP_HOST'] && ENV['COUGHDROP_CLIENT_ID']
        redirect_to "#{ENV['COUGHDROP_HOST']}/oauth2/token?client_id=#{ENV['COUGHDROP_CLIENT_ID']}&scope=read_profile&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
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
        token = nil
        if user['permissions'] && user['permissions']['admin_support_actions']
          token = ExternalSource.user_token(token['user_name'])
        end
        render json: {token: token, access: token['access_token']}
      else
        api_error 400, {error: "Code missing from response"}
      end
    end
  end
end
