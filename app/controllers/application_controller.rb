class ApplicationController < ActionController::Base
  before_action :check_token

  def check_token
    token = request.headers['Authorization'] || params['access_token'] || params['search_token']
    if token
      token = "search::#{token}" if token == params['search_token']
      token = "token::#{token}" if token != params['search_token'] && !token.match(/::/)
      type, more = token.split(/::/)
      if type == 'user' || type == 'temp'
        check = ExternalSource.confirm_user_token(token.sub(/^temp:/, 'user:'))
        if check && check[:valid]
          @admin = (type == 'user')
          @valid_token = true
          @limited_token = (type != 'user')
          response.headers['Authorized'] = true
        elsif check && check[:expired]
          api_error(401, {error: 'token expired', token_expired: true}) 
          return false
        else
          api_error(400, {error: 'invalid access token', invalid_token: true}) 
          return false
        end
      else
        options = token.split(/:/)
        check = ExternalSource.confirm_token(token)
        if check && check[:expired]
          api_error(401, {error: 'token expired', token_expired: true}) 
          return false
        elsif !check || !check[:valid]
          api_error(400, {error: 'invalid access token', invalid_token: true}) 
          return false
        end
        @valid_token = true
        @limited_token = !check[:full_access]
        response.headers['Authorized'] = true
        if type == 'search'
          @allowed_repos = check[:allowed_repos]
        end
      end
    end
    true
  end

  def check_cookie
    if cookies[:auth]
      check = ExternalSource.confirm_user_token(cookies[:auth])
      if check && check[:valid]
        @admin = true
      end
    end
  end

  def valid_search_token?
    if !@valid_token
      api_error(400, {error: 'invalid search token'})
      return false
    end
    true
  end

  def require_authorization
    if !@admin
      render json: {error: 'not authorized'}, status: 400
      return false
    end
    true
  end
  
  def exists?(obj, id)
    if !obj
      api_error(404, {error: 'not found', id: id})
      return false
    end
    true
  end

  def cross_origin
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Request-Method'] = 'GET OPTIONS'
    response.headers.except! 'X-Frame-Options'
  end

  def api_error(code, res)
    if res.is_a?(Hash)
      render json: res.to_json, status: code
    else
      render text: res, status: code
    end
  end
end
