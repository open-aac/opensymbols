require 's3'

module S3Bucket
  def self.retrieve_from_manifest(key)
    service = S3::Service.new(:access_key_id => ENV['AWS_KEY'], :secret_access_key => ENV['AWS_SECRET'])
    bucket = service.bucket('opensymbols')
    file = bucket.objects.find_all(prefix: "libraries/#{key}/manifest.json")[0]
    manifest = nil
    if file
      url = file.temporary_url
      puts "downloading #{url}..."
      json = Typhoeus.get(url).body
      manifest = JSON.parse(json) rescue nil
    end
    raise "manifest.json required but not found or invalid JSON" unless manifest
    symbols = []
    objects = bucket.objects.find_all(prefix: "libraries/#{key}", max_keys: 1000)
    images_hash = {}
    (manifest['images'] || []).each do |i|
      images_hash[i['filename']] = i
    end
    while objects && objects.length > 0
      objects.each do |obj|
        res = parse_symbol(obj, manifest, images_hash)
        symbols << res if res
      end
      puts "more to read.. (#{symbols.length})"
      objects = bucket.objects.find_all(prefix: "libraries/#{key}", max_keys: 1000, marker: CGI.escape(objects[-1].key))
    end
    [manifest['library'], symbols.compact]
  end
  
  def self.parse_symbol(s3_object, manifest, images_hash)
    path = s3_object.key
    filename = path.split(/\//)[-1]
    name, ext = filename.split(/\./, 2)
    size = s3_object.size.to_i
    return nil if name == "manifest.json" || !['png', 'svg', 'jpg', 'gif'].include?(ext)
    symbol = images_hash[filename]
    symbol ||= (manifest['images'] || []).detect{|i| i['filename'] == filename } || {}
    symbol['modified'] = s3_object.last_modified.iso8601
    symbol['path'] = path
    symbol['name'] ||= name.gsub(/_+/, " ")
    symbol['size'] ||= size
    symbol['filename'] ||= filename
    symbol['extension'] ||= ext
    default_attribution = manifest && manifest['library'] && manifest['library']['default_attribution']
    symbol['attribution'] = (default_attribution || {}).merge(symbol['attribution'] || {})
    unless symbol['attribution'] && symbol['attribution']['license_url']
      puts "no attribution found for #{symbol.to_json}"
      return nil
    end
    symbol
  end
end
