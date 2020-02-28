class Api::SymbolsController < ApplicationController
  before_action :require_authorization

  def index
  end

  def show
    repo_key, symbol_key = params['id'].split(/\//)
    symbol = PictureSymbol.find_by(repo_key: repo_key, symbol_key: symbol_key)
    symbol = nil if symbol.settings['enabled'] == false
    return unless exists?(symbol, params['id'])
    render json: JsonApi::Symbol.as_json(symbol, wrapper: true, authenticated: @authenticated)
  end

  def update
    repo_key, symbol_key = params['id'].split(/\//)
    symbol = PictureSymbol.find_by(repo_key: repo_key, symbol_key: symbol_key)
    symbol = nil if symbol.settings['enabled'] == false
    return unless exists?(symbol, params['id'])
    if params['locale']
      symbol.settings['locales'][params['locale']]['name'] = params['name'] if !params['name'].blank?
      symbol.settings['locales'][params['locale']].delete('name_defaulted')
      symbol.settings['locales'][params['locale']]['description'] = params['description'] if !params['description'].blank?
      symbol.settings['name'] = params['name'] if params['locale'] == 'en' && !params['name'].blank?
      symbol.settings['description'] = params['description'] if params['locale'] == 'en' && !params['description'].blank?
      symbol.save!
    end
    render json: JsonApi::Symbol.as_json(symbol, wrapper: true, authenticated: @authenticated)
  end

  def safe
    repo_key, symbol_key = params['symbol_id'].split(/\//)
    symbol = PictureSymbol.find_by(repo_key: repo_key, symbol_key: symbol_key)
    symbol = nil if symbol && symbol.settings['enabled'] == false
    return unless exists?(symbol, params['symbol_id'])
    symbol.settings['unsafe_result'] = params['safe'] == 'false'
    symbol.save
    render json: JsonApi::Symbol.as_json(symbol, wrapper: true, authenticated: @authenticated)
  end

  def boost
    repo_key, symbol_key = params['symbol_id'].split(/\//)
    symbol = PictureSymbol.find_by(repo_key: repo_key, symbol_key: symbol_key)
    symbol = nil if symbol && symbol.settings['enabled'] == false
    return unless exists?(symbol, params['symbol_id'])
    symbol.boost(params['keyword'], params['locale'])
    render json: JsonApi::Symbol.as_json(symbol, wrapper: true, authenticated: @authenticated)
  end

  def default
    repo_key, symbol_key = params['symbol_id'].split(/\//)
    symbol = PictureSymbol.find_by(repo_key: repo_key, symbol_key: symbol_key)
    symbol ||= PictureSymbol.find_by(repo_key: repo_key, id: symbol_key)
    symbol = nil if symbol && symbol.settings['enabled'] == false
    return unless exists?(symbol, params['symbol_id'])
    symbol.set_as_default(params['keyword'], params['locale'])
    render json: JsonApi::Symbol.as_json(symbol, wrapper: true, authenticated: @authenticated)
  end

end
