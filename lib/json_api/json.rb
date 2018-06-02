module JsonApi::Json
  # TODO: wrapper for common stuff like pagination, permissions?
  def as_json(obj, args={})
    args = args.with_indifferent_access
    if obj.respond_to?(:cached_json_response) && !args[:nocache]
      res = obj.cached_json_response
      return res if res
    end
    json = build_json(obj, args)
    if args[:wrapper]
      new_json = {}
      new_json[self::TYPE_KEY] = json
      json = new_json
      if self.respond_to?(:extra_includes)
        json = extra_includes(obj, json, args)
      end
      if self.respond_to?(:meta)
        metadata = self.meta(obj)
        json['meta'] = metadata if !metadata.blank?
      end
    end
    json
  end
  
  def paginate(params, where, args={})
    per_page = params['per_page'] ? [self::MAX_PAGE, params['per_page'].to_i].min : self::DEFAULT_PAGE
    offset = params['offset'].to_i || 0
    if where.is_a?(Array)
      where = where[offset, per_page + 1]
    else
      where = where.limit(per_page + 1).offset(offset)
    end
    more = !!where[per_page]
    json = {
      :meta => {
        :per_page => per_page,
        :offset => offset,
        :next_offset => offset + per_page,
        :more => more,
        :next_url => nil
      }
    }
    extra_meta = {}
    if self.respond_to?(:paginate_meta)
      extra_meta = self.paginate_meta(params, json)
      extra_meta.each do |key, val|
        json[:meta][key] = val
      end
    end
    if more
      prefix = "#{JsonApi::Json.current_host}/api/v1/#{self::TYPE_KEY.pluralize}"
      if args[:prefix] || args['prefix']
        prefix = args[:prefix] || args['prefix']
        prefix = "#{JsonApi::Json.current_host}/api/v1" + prefix if prefix.match(/^\//)
      end
      
      json[:meta][:prefix] = prefix
      json[:meta][:next_url] = prefix + "?offset=#{offset+per_page}&per_page=#{per_page}"
      extra_meta.each do |key, val|
        json[:meta][:next_url] += "&#{key.to_s}=#{CGI.escape(val.to_s)}" if val
      end
    end
    results = where[0, per_page]
    args[:page_results] = results
    if self.respond_to?(:page_data)
      args[:page_data] = self.page_data(results)
    end
    json[self::TYPE_KEY] = results.map{|i| as_json(i, args) }
    json
  end
  
  def self.set_host(host)
    @@running_hosts ||= {}
    @@running_hosts[Worker.thread_id] = host
  end
  
  def self.current_host
    @@running_hosts ||= {}
    @@running_hosts[Worker.thread_id] || ENV['DEFAULT_HOST']
  end
end