require 'elasticsearch'

module ElasticSearcher
  def self.searcher
    opts = {host: (ENV['ELASTIC_SEARCH_URL'] || ENV['BONSAI_URL'] || ENV['FOUNDELASTICSEARCH_URL']), log: (ENV['RAILS_ENV'] == 'development')}
    if ENV['ELASTIC_USER'] && ENV['ELASTIC_TOKEN']
      opts[:user] = ENV['ELASTIC_USER']
      opts[:password] = ENV['ELASTIC_TOKEN']
    end
    opts[:request_timeout] = 10
    @@client ||= Elasticsearch::Client.new(opts)
    @@version ||= @@client.info['version']['number']
    @@client
  end
  
  def self.enabled?
    ENV['RAILS_ENV'] != 'test' && !!self.searcher
  end
  
  def self.index_symbol(symbol, locale='en')
    index = "open-symbols-#{locale}"
    json = symbol.obj_json(true, locale)
    json[:use_scores] = json[:use_scores].to_json if json[:use_scores]
    json['use_scores'] = json['use_scores'].to_json if json['use_scores']
    self.index index: index, type: 'symbol', id: symbol.id, locale: locale, body: json
  end
  
  def self.remove_symbol(symbol, locale='en')
    index = "open-symbols-#{locale}"
    self.remove index: index, type: 'symbol', id: symbol.id
  end
  
  def self.search_symbols(q, locale='en', opts=nil)
    if q.length < 10
      match = q.match(Unicode::Emoji::REGEX)
      if match && match[0] == q
        q = q.each_codepoint.map {|n| n.to_s(16) }.join('-')
      end
    end
    opts ||= {}
    repo_filter = opts[:repo_filter]
    favored_repo_filter = opts[:favored_repo_filter]
    safe_search = opts[:safe_search]
    allow_protected = opts[:allow_protected]
    protected_repos = opts[:protected_repos] || []
    allow_protected = false if protected_repos.empty? 
    escaped_characters = Regexp.escape('\\+-&|!(){}[]^~*?:')
    index = "open-symbols-#{locale}"
    q = q.to_s.gsub(/([#{escaped_characters}])/, '\\\\\1')
    q = q.gsub(/\//, ' ').strip
    query = {
      bool: {
        must: {
          query_string: {query: q}
        },
        should: {
          multi_match: {
            type: 'best_fields',
            query: q,
            fields: ['name^2', 'search_string', 'search_string.stemmed', 'repo_key', 'image_url']
          }
        },
        filter: [{term: {enabled: true}}, {term: {protected_symbol: false}}]
      }
    }

    if repo_filter
      # http://stackoverflow.com/questions/11566838/elastic-search-hyphen-issue-with-term-filter
      repo_filter = repo_filter.split(/-/)[0]
      query[:bool][:filter] ||= []
      query[:bool][:filter] << {term: {repo_key: repo_filter}}
    end
    if allow_protected
      query[:bool][:filter] ||= []
      query[:bool][:filter].select!{|f| !f[:term].keys.include?(:protected_symbol) }
    end

    boost = []
    boost << {"#{env_index(index)}" => 3}
    # boost[env_index(index)] = 3
    raw_list = self.search index: 'open-symbols-*', type: 'symbol', body: {
      from: 0,
      size: 200,
      query: query,#{query_string: {query: q}},
      indices_boost: boost
#       query: {
#         function_score: {
#           boost_mode: 'replace',
#           query: {
#             query_string: {
#               query: q.to_s
#             }
#           },
#           script_score: {
#             params: {
#               keyword: q.to_s
#             },
#             script: "_score * ((_source['use_scores'] != nil && _source['use_scores'][keyword] != nil) ? (1.0 + _source['use_scores'][keyword]) : 1.0)"
#           }
#         }
#       }
    }
    repo_counts = {}
    allow_search_all = allow_protected && protected_repos == ['*']
    
    res = raw_list['hits']['hits'].map{ |hit|
      res = hit['_source']
      res['use_scores'] = JSON.parse(res['use_scores']) if res['use_scores'].is_a?(String)
      res['use_score'] = ((res['use_scores'] && res['use_scores'][q]) || 1.0)
      res['relevance'] = hit['_score'] * (res['use_score'] / 3.0)
      res['relevance'] *= 2 if (res['name'] || "").downcase == q.downcase
      res
    }.uniq{|hit| hit['id'] }.select{|hit|
      # don't show repeat search results (result of multi-index search)
      !safe_search || !hit['unsafe_result']
    }.select{|hit|
      allow_search_all || !hit['protected_symbol']|| (allow_protected && protected_repos.include?(hit['repo_key']))
    }.sort_by{|hit| hit['relevance'] }.reverse.map{ |res|
      repo_counts[res['repo_key']] ||= 0
      repo_counts[res['repo_key']] += 1
      res['repo_index'] = 0
      res['repo_index'] = 1 if repo_counts[res['repo_key']] <= 10
      res['repo_index'] = 2 if repo_counts[res['repo_key']] <= 5
      res.delete('use_scores')
      res
    }.sort_by{|hit|
      # max of 5 results per repo
      [hit['repo_index'], hit['relevance']]
    }.reverse[0, 50]
    if favored_repo_filter
      # If there's a favored repo, move that repo's results to the front
      res = (res[0, 10].select{|s| s['repo_key'] == favored_repo_filter } + res).uniq
    end
    if res[0] && res[0]['protected_symbol'] && res[0, 10].detect{|s| !s['protected_symbol'] }
      # If a mix of protected and non-protected, favor non-protected
      res = ([res[0, 10].detect{|s| !s['protected_symbol'] }] + res).uniq
    end
    res
  end

  MAPPING_LOCALES = {
    'en' => 'english',
    'ar' => 'arabic',
    'hy' => 'armenian', 
    'eu' => 'basque', 
    'bn' => 'bengali', 
    'bg' => 'bulgarian', 
    'ca' => 'catalan', 
    'cs' => 'czech', 
    'nl' => 'dutch', 
    'fi' => 'finnish', 
    'fr' => 'french', 
    'gl' => 'galician', 
    'de' => 'german', 
    'hi' => 'hindi', 
    'hu' => 'hungarian', 
    'id' => 'indonesian', 
    'ga' => 'irish', 
    'it' => 'italian', 
    'lv' => 'latvian', 
    'lt' => 'lithuanian', 
    'nb' => 'norwegian', 
    'nn' => 'norwegian', 
    'pt' => 'portuguese', 
    'ro' => 'romanian', 
    'ru' => 'russian', 
    'ckb' => 'sorani', 
    'es' => 'spanish', 
    'sv' => 'swedish', 
    'tr' => 'turkish'
  }

  def self.bulk(&block)
    @bulk_indexing = []
    block.call
    if @bulk_indexing.length > 0
      self.searcher.bulk(body: @bulk_indexing, timeout: '60s')
    end
    @bulk_indexing = nil
  end

  def self.index(opts)
    opts[:index] = self.env_index(opts[:index])
    locale = opts.delete(:locale)
    return if locale == 'hmn'
    analyzer = MAPPING_LOCALES[locale] || 'standard'
    type = @@version.to_i < 3 ? 'string' : 'text'
    update = {
      symbol: {
        properties: {
          search_string: {
            type: type,
            fields: {
              stemmed: {
                type: type,
                analyzer: analyzer
              }
            }
          }
        }
      }
    }
    @mappers ||= {}
    begin
      if @bulk_indexing
        @bulk_indexing << {
          'index' => {
            '_index' => opts[:index],
            '_type' => opts[:type],
            '_id' => opts[:id]  
          }
        }
        @bulk_indexing << opts[:body]
      else
        self.searcher.index(opts)
      end
    rescue => e
      puts JSON.pretty_generate(opts)
      raise e
    end
    # if (!@mappers[opts[:index]] || @mappers[opts[:index]] < 90.minutes.ago)
    #   self.searcher.indices.put_mapping index: opts[:index], type: opts[:type], body: update
    #   @mappers[opts[:index]] = Time.now
    # end
  end
  
  def self.remove(opts)
    opts[:index] = self.env_index(opts[:index])
    begin
      if @bulk_indexing
        @bulk_indexing << {
          'delete' => {
            '_index' => opts[:index],
            '_type' => opts[:type],
            '_id' => opts[:id]  
          }
        }
      else
        self.searcher.delete(opts)
      end
    rescue => e
    end
  end
  
  def self.search(opts)
    opts[:index] = self.env_index(opts[:index])
    opts[:timeout] = '10s'
    self.searcher.search(opts)
  end
  
  def self.delete_index(opts)
    #raise "no" unless ENV['RAILS_ENV'] == 'test'
    opts[:index] = self.env_index(opts[:index])
    self.searcher.indices.delete(opts) rescue nil
  end
  
  def self.env_index(index)
    (ENV['RAILS_ENV'] || 'development') + '-' + index
  end
end