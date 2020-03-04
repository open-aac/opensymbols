class Api::RepositoriesController < ApplicationController
  before_action :require_authorization, :except => [:defaults]

  def index
  end

  def show
    repo = SymbolRepository.find_by(repo_key: params['id'])
    return unless exists?(repo, params['id'])
    render json: JsonApi::Repository.as_json(repo, wrapper: true, authenticated: @admin)
  end

  def defaults
    repo = SymbolRepository.find_by(repo_key: params['repository_id'])
    return unless exists?(repo, params['repository_id'])
    if repo.settings['protected'] && !@admin
      return unless valid_search_token?
      return api_error(400, {error: 'unsupported repo'}) unless @allowed_repos.include?(repo.repo_key)
    end
    return api_error(400, {error: 'limited to 200 words at a time'}) if (params['words'] || []).length > 200
    return api_error(400, {error: 'no words specified'}) unless (params['words'] || []).length > 0

    core = repo.default_core_words
    locale = params['locale'] || 'en'
    lang = core[params['locale']] || core['en']
    keys = {}
    (params['words'] || []).each do |word|
      keys[lang[word.downcase]] = word if lang[word.downcase]
    end
    res = {}
    PictureSymbol.where(symbol_key: keys.map(&:first)).each do |symbol|
      res[keys[symbol.symbol_key]] = symbol.obj_json(false, locale)
    end
    render json: res
  end

  def images
    repo = SymbolRepository.find_by(repo_key: params['repository_id'])
    return unless exists?(repo, params['repository_id'])
    keys = params['keywords']
    locale = params['locale']

    # get the image_urls for all the keyword-defaulted symbols
    symbol_keys = []
    mod = RepositoryModifier.find_for(repo, locale)
    mod.settings['defaults'].each do |keyword, symbol_key|
      symbol_keys << symbol_key if keys.include?(keyword)
    end
    symbols = PictureSymbol.where(repo_key: repo.repo_key, symbol_key: symbol_keys)
    hash = {}
    symbols.each{|s| hash[s.symbol_key] = s.settings['image_url'] }

    # generate a (sorted) list of all result, including images
    res = []
    words = (((SymbolRepository.core_lists[locale] || []) & keys) + keys).uniq
    words.each do |word|
      symbol_key = mod.settings['defaults'][word]
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
