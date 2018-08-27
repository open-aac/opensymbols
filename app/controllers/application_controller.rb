class ApplicationController < ActionController::Base
  before_action :check_token

  def check_token
    if request.headers['Authorization']
      check = ExternalSource.confirm_user_token(request.headers['Authorization'])
      if check && check[:valid]
        @authenticated = true
        response.headers['Authorized'] = true
      end
    end
    true
  end

  def check_cookie
    if cookies[:auth]
      check = ExternalSource.confirm_user_token(cookies[:auth])
      if check && check[:valid]
        @authenticated = true
      end
    end
  end

  def valid_search_token?(token)
    return false unless token
    token, repos = params['search_token'].split(/:/)
    source = ExternalSource.find_by(token: token)
    return api_error(400, {error: 'invalid search token'}) unless source
    @allowed_repos = (repos || '').split(/,/)
  end

  def require_authorization
    if !@authenticated
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
