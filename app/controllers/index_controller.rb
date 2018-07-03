class IndexController < ApplicationController
  before_action :check_cookie

  def root; end

  def search; 
    render 'root'
  end

  def editor; end

  def badge_maker; end
  
  def word_maker; end

  def word_art; end

  def repo
    @repo = SymbolRepository.find_by(repo_key: params['repo_key'])
    @repo = nil if @repo && @repo.settings['protected'] && !@authenticated
    return api_error(400, 'Invalid repository') unless @repo
  end

  def symbol
    @repo = SymbolRepository.find_by(:repo_key => params['repo_key'])
    @repo = nil if @repo && @repo.settings['protected'] && !@authenticated
    api_error(400, "Invalid repository") unless @repo
    @symbol = PictureSymbol.find_by(:repo_key => @repo.repo_key, :symbol_key => params['symbol_key'], :id => params['id']) if params['id']
    @symbol ||= PictureSymbol.find_by(:repo_key => @repo.repo_key, :symbol_key => params['symbol_key'])
    @symbol = nil if @symbol && @symbol.settings['enabled'] == false
    @symbol = @symbol.obj_json if @symbol
    return api_error(400, "Invalid symbol") unless @symbol
  end

  def stats
  end
end
