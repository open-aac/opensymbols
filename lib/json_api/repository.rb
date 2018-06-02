module JsonApi::Repository
  extend JsonApi::Json
  
  TYPE_KEY = 'repository'
  DEFAULT_PAGE = 25
  MAX_PAGE = 50
  
  def self.build_json(repo, args={})
    {
      repo_key: repo.repo_key,
      name: repo.settings['name']
    }
end
  
  def self.extra_includes(repo, json, args={})
    if args['authenticated']
      json['repository']['default_core_words'] = repo.settings['defaults'] || {}
      json['repository']['missing_core_words'] = repo.missing_core_words
    end
    json
  end
end
