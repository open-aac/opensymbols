require 'elasticsearch'

module ElasticSearcher
  def self.searcher
    opts = {host: (ENV['ELASTIC_SEARCH_URL'] || ENV['BONSAI_URL'] || ENV['FOUNDELASTICSEARCH_URL']), log: (ENV['RAILS_ENV'] == 'development')}
    if ENV['ELASTIC_USER'] && ENV['ELASTIC_TOKEN']
      opts[:user] = ENV['ELASTIC_USER']
      opts[:password] = ENV['ELASTIC_TOKEN']
    end
    @@client ||= Elasticsearch::Client.new(opts)
    @@version ||= @@client.info['version']['number']
    @@client
  end
  
  def self.enabled?
    ENV['RAILS_ENV'] != 'test' && !!self.searcher
  end
  
  def self.index_symbol(symbol, locale='en')
    index = "open-symbols-#{locale}"
    self.index index: index, type: 'symbol', id: symbol.id, locale: locale, body: symbol.obj_json(true, locale)
  end
  
  def self.remove_symbol(symbol, locale='en')
    index = "open-symbols-#{locale}"
    self.remove index: index, type: 'symbol', id: symbol.id
  end
  
  def self.search_symbols(q, locale='en', opts=nil)
    opts ||= {}
    repo_filter = opts[:repo_filter]
    safe_search = opts[:safe_search]
    allow_protected = opts[:allow_protected]
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
            fields: ['search_string', 'search_string.stemmed', 'repo_key', 'image_url']
          }
        },
        filter: [{term: {enabled: true}}]
      }
    }

    if repo_filter
      # http://stackoverflow.com/questions/11566838/elastic-search-hyphen-issue-with-term-filter
      repo_filter = repo_filter.split(/-/)[0]
      query[:bool][:filter] ||= []
      query[:bool][:filter] << {term: {repo_key: repo_filter}}
    end

    boost = {}
    boost[index] = 3
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
    
    raw_list['hits']['hits'].map{ |hit|
      res = hit['_source']
      res['relevance'] = hit['_score'] * ((res['use_scores'] && res['use_scores'][q]) || 1.0)
      res['relevance'] *= 2 if (res['name'] || "").downcase == q.downcase
      res
    }.select{|hit|
      !safe_search || !hit['unsafe_result']
    }.select{|hit|
      allow_protected || !hit['protected_symbol']
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
  end

  MAPPING_LOCALES = {
    'en' => 'english'
  }
  
  def self.index(opts)
    opts[:index] = self.env_index(opts[:index])
    locale = opts.delete(:locale)
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
      self.searcher.index(opts)
    rescue => e
      puts JSON.pretty_generate(opts)
      raise e
    end
    if !@mappers[opts[:index]] || @mappers[opts[:index]] < 30.minutes.ago
      self.searcher.indices.put_mapping index: opts[:index], type: opts[:type], body: update
      @mappers[opts[:index]] = Time.now
    end
end
  
  def self.remove(opts)
    opts[:index] = self.env_index(opts[:index])
    begin
      self.searcher.delete(opts)
    rescue => e
    end
  end
  
  def self.search(opts)
    opts[:index] = self.env_index(opts[:index])
    self.searcher.search(opts)
  end
  
  def self.delete_index(opts)
    raise "no" unless ENV['RAILS_ENV'] == 'test'
    opts[:index] = self.env_index(opts[:index])
    self.searcher.indices.delete(opts) rescue nil
  end
  
  def self.env_index(index)
    (ENV['RAILS_ENV'] || 'development') + '-' + index
  end
end