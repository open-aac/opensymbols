module JsonApi::Symbol
  extend JsonApi::Json
  
  TYPE_KEY = 'symbol'
  DEFAULT_PAGE = 25
  MAX_PAGE = 50
  
  def self.build_json(symbol, args={})
    args['locale'] ||= 'en'
    symbol.obj_json(false, args['locale'])
  end
  
  def self.extra_includes(symbol, json, args={})
    if args['authenticated']
      json['symbol']['use_scores'] = ((symbol.settings['locales'] || {})[args['locale']] || {})['use_scores'] || {}
      json['symbol']['locales'] = symbol.locale_settings
    end
    json
  end
end
