class IndexController < ApplicationController
  before_action :check_cookie

  def root; end

  def search; 
    render 'root'
  end

  def api
    @token = ExternalSource.user_token(Date.today.to_s).sub(/^user:/, 'temp:')
  end

  def editor
    cross_origin
  end

  def badge_maker
    cross_origin
  end
  
  def word_maker
    cross_origin
  end

  def word_art
    cross_origin
  end

  def repo
    @repo = SymbolRepository.find_by(repo_key: params['repo_key'])
    @repo = nil if @repo && @repo.settings['protected'] && !@admin
    return api_error(400, 'Invalid repository') unless @repo
  end

  def symbol
    @repo = SymbolRepository.find_by(:repo_key => params['repo_key'])
    @repo = nil if @repo && @repo.settings['protected'] && !@admin
    api_error(400, "Invalid repository") unless @repo
    @symbol = PictureSymbol.find_by(:repo_key => @repo.repo_key, :symbol_key => params['symbol_key'], :id => params['id']) if params['id']
    @symbol ||= PictureSymbol.find_by(:repo_key => @repo.repo_key, :symbol_key => params['symbol_key'])
    @symbol = nil if @symbol && @symbol.settings['enabled'] == false
    @symbol = @symbol.obj_json if @symbol
    return api_error(400, "Invalid symbol") unless @symbol
  end

  def core
    return api_error(400, 'Not authorized') unless @admin
    @core_lists = SymbolRepository.core_lists
  end

  def stats
  end
end
