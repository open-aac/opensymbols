require 's3'

module S3Bucket
  S3_EXPIRATION_TIME=60*60
  CONTENT_LENGTH_RANGE=200.megabytes.to_i

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
        symbols << res if res && res['path'] && !res['path'].match(/\.raster\.png$/)
      end
      puts "more to read.. (#{symbols.length})"
      objects = bucket.objects.find_all(prefix: "libraries/#{key}", max_keys: 1000, marker: CGI.escape(objects[-1].key))
    end
    [manifest['library'], symbols.compact]
  end

  def self.rasterize_images(key, force=false)
    service = S3::Service.new(:access_key_id => ENV['AWS_KEY'], :secret_access_key => ENV['AWS_SECRET'])
    bucket = service.bucket('opensymbols')
    rasters = []
    errors = []
    images_hash = {}

    rastered_keys = {}
    to_rasterize = []
    objects = bucket.objects.find_all(prefix: "libraries/#{key}", max_keys: 1000)
    while objects && objects.length > 0
      objects.each do |obj|
        if obj.key && obj.key.match(/\.raster\.png$/)
          rastered_keys[obj.key.sub(/\.raster\.png$/, '')] = true
          puts obj.key.sub(/\.raster\.png$/, '')
        else
          to_rasterize << obj
        end
      end
      puts "more to read.. (#{to_rasterize.length})"
      objects = bucket.objects.find_all(prefix: "libraries/#{key}", max_keys: 1000, marker: CGI.escape(objects[-1].key))
    end
    to_rasterize.each do |obj|
      symbol = parse_symbol(obj, {}, nil) rescue nil
      if symbol && symbol['extension'] == 'svg'
        # check for existing (unless force)
        url = "#{ENV['S3_CDN']}/#{symbol['path']}"
        res = true if rastered_keys[symbol['path']]
        res ||= Typhoeus.head(URI.escape("#{url}.raster.png"), followlocation: true)
        if res == true
          puts "already rasterized #{symbol['filename']}"
        elsif !res.success? || force
          puts "rasterizing #{symbol['filename']}"
          # download the image
          file = Tempfile.new(["stash", '.svg'])
          file.binmode
          res = Typhoeus.get(URI.escape(url), followlocation: true)
          file.write(res.body)
          # convert it locally
          `convert -background none -density 300 -resize 400x400 -gravity center -extent 400x400 #{file.path} #{file.path}.raster.png`
          # upload the rasterized version
          file.close

          params = remote_upload_params("#{symbol['path']}.raster.png", 'image/png')
          post_params = params[:upload_params]
          if File.exist?("#{file.path}.raster.png")
            post_params[:file] = File.open("#{file.path}.raster.png", 'rb')
        
            # upload to s3 from tempfile
            res = Typhoeus.post(params[:upload_url], body: post_params)
            if res.success?
              puts "  success!"
              rasters << symbol
            else
              errors << symbol
            end
          else
            errors << symbol
          end
        end
      end
    end
    {rasters: rasters, errors: errors}
  end
  
  def self.parse_symbol(s3_object, manifest, images_hash)
    path = s3_object.key
    filename = path.split(/\//)[-1]
    name, ext = filename.split(/\./, 2)
    size = s3_object.size.to_i
    return nil if name == "manifest.json" || !['png', 'svg', 'jpg', 'gif'].include?(ext)
    symbol = images_hash && images_hash[filename]
    symbol ||= (manifest['images'] || []).detect{|i| i['filename'] == filename } || {}
    symbol['modified'] = s3_object.last_modified.iso8601
    symbol['path'] = path
    symbol['name'] ||= name.gsub(/_+/, " ")
    symbol['size'] ||= size
    symbol['filename'] ||= filename
    symbol['extension'] ||= ext
    default_attribution = manifest && manifest['library'] && manifest['library']['default_attribution']
    symbol['attribution'] = (default_attribution || {}).merge(symbol['attribution'] || {})
    if images_hash
      unless symbol['attribution'] && symbol['attribution']['license_url']
        puts "no attribution found for #{symbol.to_json}"
        return nil
      end
    end
    symbol
  end

  def self.remote_upload_params(remote_path, content_type)
    config = remote_upload_config
    
    res = {
      :upload_url => config[:upload_url],
      :upload_params => {
        'AWSAccessKeyId' => config[:access_key]
      }
    }
    
    policy = {
      'expiration' => (S3_EXPIRATION_TIME).seconds.from_now.utc.iso8601,
      'conditions' => [
        {'key' => remote_path},
        {'acl' => 'public-read'},
        ['content-length-range', 1, (CONTENT_LENGTH_RANGE)],
        {'bucket' => config[:bucket_name]},
        {'success_action_status' => '200'},
        {'content-type' => content_type}
      ]
    }
    # TODO: for pdfs, policy['conditions'] << {'content-disposition' => 'inline'}

    policy_encoded = Base64.encode64(policy.to_json).gsub(/\n/, '')
    signature = Base64.encode64(
      OpenSSL::HMAC.digest(
        OpenSSL::Digest.new('sha1'), config[:secret], policy_encoded
      )
    ).gsub(/\n/, '')

    res[:upload_params].merge!({
       'key' => remote_path,
       'acl' => 'public-read',
       'policy' => policy_encoded,
       'signature' => signature,
       'Content-Type' => content_type,
       'success_action_status' => '200'
    })
    res
  end

  def self.remote_upload_config
    @remote_upload_config ||= {
      :upload_url => "https://#{ENV['S3_BUCKET']}.s3.amazonaws.com/",
      :access_key => ENV['AWS_KEY'],
      :secret => ENV['AWS_SECRET'],
      :bucket_name => ENV['S3_BUCKET'],
      :static_bucket_name => ENV['S3_BUCKET']
    }
  end
end
