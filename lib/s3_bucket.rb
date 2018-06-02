module S3Bucket
  def self.retrieve_from_manifest(key)
    json = Typhoeus.get("https://s3.amazonaws.com/#{ENV['S3_BUCKET']}/libraries/#{key}/manifest.json").body
    manifest = JSON.parse(json) rescue nil
    raise "manifest.json required but not found or invalid JSON" unless manifest
    symbols = []
    xml = Typhoeus.get("https://s3.amazonaws.com/#{ENV['S3_BUCKET']}/?prefix=libraries/#{key}").body
    doc = Nokogiri(xml)
    images_hash = {}
    (manifest['images'] || []).each do |i|
      images_hash[i['filename']] = i
    end
    while doc
      doc.css("Contents").each do |item|
        res = parse_symbol(item, manifest, images_hash)
        symbols << res if res
      end
      if doc.css("IsTruncated")[0].content == "true"
        puts "more to read.. (#{symbols.length})"
        url = "https://s3.amazonaws.com/#{ENV['S3_BUCKET']}/?prefix=libraries/#{key}&marker=#{CGI.escape(symbols[-1]['path'])}"
        xml = Typhoeus.get(url).body
        doc = Nokogiri(xml)
      else
        doc = nil
      end
    end
    [manifest['library'], symbols.compact]
  end
  
  def self.parse_symbol(nokogiri_elem, manifest, images_hash)
    path = nokogiri_elem.css("Key")[0].content
    filename = path.split(/\//)[-1]
    name, ext = filename.split(/\./, 2)
    size = nokogiri_elem.css("Size")[0].content.to_i
    return nil if name == "manifest.json" || !['png', 'svg', 'jpg', 'gif'].include?(ext)
    symbol = images_hash[filename]
    symbol ||= (manifest['images'] || []).detect{|i| i['filename'] == filename } || {}
    symbol['modified'] = nokogiri_elem.css("LastModified")[0].content
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
