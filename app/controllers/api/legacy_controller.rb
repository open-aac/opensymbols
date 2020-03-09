class Api::LegacyController < ApplicationController
  def repo_symbols
    cross_origin
    repo = SymbolRepository.find_by(:repo_key => params['repo_key'])
    repo = nil if repo && repo.settings['protected'] && !@admin
    return api_error(400, {error: 'not found'}) unless repo
    page = params['page'].to_i
    per_page = 60
    symbols = PictureSymbol.where(repo_key: repo.repo_key)[page * per_page, per_page]
    more = PictureSymbol.where(repo_key: repo.repo_key)[page * (per_page + 1)]
    res = {symbols: symbols.map{|s| s.obj_json }}
    if more
      res[:meta] = {
        next_url: "#{request.protocol}#{request.host_with_port}/api/v1/repositories/#{params['repo_key']}/symbols?page=#{page + 1}"
      }
    end
    render json: res.to_json
  end

  def search
    cross_origin
    protected_repos = (@admin && params['q'].match(/repo/)) ? ['*'] : []
    allow_protected = !!@admin
    if params['search_token']
      return unless valid_search_token?
      allow_protected = true
      protected_repos = @allowed_repos
    end
    results = PictureSymbol.search(params['q'], params['locale'] || 'en', params['safe'] != '0', allow_protected, protected_repos)
    render json: results.to_json
  end

  def track_use
    return api_error(400, {:error => "token required"}) unless @valid_token
    return api_error(400, {:error => "full access token required"}) if @limited_token
    symbol = PictureSymbol.find_by(:id => params['id'])
    return unless exists?(symbol, params['id'])
    user_id = @token.user_id(params['user_id'])
    locale = (params['locale'] || 'en').downcase.split(/[-_]/)[0]
    symbol.used_for_keyword(params['keyword'], locale, user_id)
    render json: {tracked: true}
  end

  def random_symbols
    cross_origin
    list = PictureSymbol.all.offset(rand([2, PictureSymbol.max_count - 20].max)).order('random').limit(30).select{|s| s.settings['enabled'] != false && !s.settings['protected_symbol'] && s.safe_result? }
    render json: list[0, 9].map(&:obj_json)
  end

  def data_proxy
    pre, post = params['data'].split(/;/)
    content_type = pre.split(/:/)[1]
    content = Base64.strict_decode64(post.sub(/^base64,/, ''))
    headers['Content-Type'] = content_type
    render text: content
  end

  def proxy
    cross_origin
    api_error(400, "") unless params['url'] && @valid_token

    uri = URI.parse(params['url']) rescue nil
    uri ||= URI.parse(URI.escape(params['url']))
    request = Typhoeus::Request.new(uri.to_s, followlocation: true, follow_location: true, timeout: 10)
    begin
      content_type, body = get_url_in_chunks(request)
    rescue BadFileError => e
      error = e.message
    end

    if !error
      str = "data:" + content_type
      str += ";base64," + Base64.strict_encode64(body)
      headers['Access-Control-Allow-Origin'] = '*'
      render json: {content_type: content_type, data: str}.to_json
    else
      api_error(400, {error: error})
    end
  end

  class BadFileError < StandardError
  end

  protected

  def get_url_in_chunks(request)
    content_type = nil
    body = ""
    so_far = 0
    done = false
    request.on_headers do |response|
      # Some services (ahem, flickr) are returning a Location header, along with the response body
      if response.headers['Location'] && (response.code >= 300 || (response.headers['Content-Length'] && response.headers['Content-Length'].to_i <= response.headers['Location'].length))
        return ['redirect', URI.escape(response.headers['Location'])]
      end
      if response.success? || response.code == 200
        # TODO: limit to accepted file types
        content_type = response.headers['Content-Type']
        if !content_type.match(/^image/) && !content_type.match(/^audio/)
          raise BadFileError, "Invalid file type, #{content_type}"
        end
      else
        raise BadFileError, "File not retrieved, status #{response.code}"
      end
    end
    request.on_body do |chunk|
      so_far += chunk.size
      if so_far < 100 * (1024 * 1024)
        body += chunk
      else
        raise BadFileError, "File too big (> #{100 * (1024 * 1024)})"
      end
    end
    request.on_complete do |response|
      if !response.success? && response.code != 200
        raise BadFileError, "Bad file, #{response.code}"
      end
      done = true
    end
    request.run
    return [content_type, body]
  end
end
