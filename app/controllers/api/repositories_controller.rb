class Api::RepositoriesController < ApplicationController
  before_action :require_authorization

  def index
  end

  def show
    repo = SymbolRepository.find_by(repo_key: params['id'])
    return unless exists?(repo, params['id'])
    render json: JsonApi::Repository.as_json(repo, wrapper: true, authenticated: @authenticated)
  end

  def images
    repo = SymbolRepository.find_by(repo_key: params['repository_id'])
    return unless exists?(repo, params['repository_id'])
    keys = params['keywords']
    locale = params['locale']

    # get the image_urls for all the keyword-defaulted symbols
    symbol_keys = []
    repo.settings['defaults'][locale].each do |keyword, symbol_key|
      symbol_keys << symbol_key if keys.include?(keyword)
    end
    symbols = PictureSymbol.where(repo_key: repo.repo_key, symbol_key: symbol_keys)
    hash = {}
    symbols.each{|s| hash[s.symbol_key] = s.settings['image_url'] }

    # generate a (sorted) list of all result, including images
    res = []
    words = (((SymbolRepository.core_lists[locale] || []) & keys) + keys).uniq
    words.each do |word|
      symbol_key = repo.settings['defaults'][locale][word]
      res << {
        keyword: word,
        symbol_key: symbol_key,
        image_url: hash[symbol_key]
      }
    end
    render json: res
  end

  def update
  end
end
