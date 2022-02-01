module ColorShift
  SKIN_TONES = {
    'light' => {'skin' => 'f7dece'}, 
    'medium' => {'skin' => 'd5ab88'}, 
    'medium-dark' => {'skin' => 'af7e57'}, 
    'dark' => {'skin' => '7c533e'}
  }
  SKIN_TONE_NAMES = ['default'] + SKIN_TONES.keys

  def self.variant_url(symbol, seed=nil, preferred=nil)
    seed ||= 'default'
    seed_int = Digest::Md5.hexdigest(seed.to_s + symbol.id.to_s + symbol.random.to_s).to_i(16)
    ext = symbol.settings['file_extension']
    if preferred == 'default'
      # return the default
    elsif symbol.settings['has_variants']
      if preferred && SKIN_TONES[preferred]
        # return the toned url
        return "#{ENV['S3_CDN']}/#{symbol.settings['image_url']}.variant-#{preferred}.#{ext}"
      elsif preferred
        # find the nearest variant
      else
        idx = seed_int % SKIN_TONE_NAMES.to_a.length
        if idx = 0
          # return the default
        else
          tone, color = SKIN_TONE_NAMES.to_a[idx]
          return "#{ENV['S3_CDN']}/#{symbol.settings['image_url']}.variant-#{tone}.#{ext}"
        end
      end
    end
    "#{ENV['S3_CDN']}/#{symbol.settings['image_url']}"
  end

  def self.generate_variants(symbol, force=false)
    return false if symbol.settings['has_skin'] == false && !force
    puts "== #{symbol.settings['name']} #{symbol.repo_key} =="
    source = symbol.repo_key
    # download the original image
    ext = symbol.settings['file_extension']
    original_url = "#{ENV['S3_CDN']}/#{symbol.settings['image_url'].sub(/^\//, '')}"
    file = Tempfile.new(["stash", ".#{ext}"])
    file.binmode
    res = Typhoeus.get(URI.escape(original_url), followlocation: true)
    file.write(res.body)
    file.close
    local_filename = file.path
    content_type = nil
    if ext == 'svg'
      content_type = 'image/svg+xml'
    elsif ext == 'png'
      content_type = 'image/png'
    else
      raise "unrecognized extension #{ext}"
    end 
    if source == 'arasaac'
      # check for any images with white spots (didn't get transparentified)
      has_white = false
      lines = `convert #{local_filename} txt:- | grep FFFFFF`.split(/\n/)
      line = lines.map{|l| l.match(/^\d+,\d+:/) }.compact[0]
      if line
        puts '  image has white'
        symbol.settings['has_white'] = true 
        symbol.save_without_indexing
      end
    end

    # generate listed tones
    success = true
    known_source = false
    SKIN_TONES.to_a.each do |tone, colors|
      output = Tempfile.new([symbol.settings['name'].gsub(/\s+/, '-'), "-variant-#{tone}"])
      output_filename = "#{output.path}.#{ext}"
      output.unlink
      if source == 'arasaac'
        known_source = true
        fn = local_filename
        repeat = true
        while repeat
          # loop until no skin colors remain

          lines = `convert #{fn} txt:- | grep F7E7E0`.split(/\n/)
          line = lines.map{|l| l.match(/^\d+,\d+:/) }.compact[0]
          if line
            x, y = line[0].split(/,/).map(&:to_i)
            pct = tone == 'dark' ? 50 : 30
            `convert #{fn} -fill "##{colors['skin']}" -fuzz #{pct}% -floodfill +#{x}+#{y} "#f7e7e0" #{output_filename}`
            fn = output_filename
          else
            repeat = false
          end
        end
        if fn == output_filename
          `open #{fn}`
        end
      elsif source == 'mulberry'
        known_source = true
        str = File.read(local_filename)
        str.gsub(/FFEEC8/, color['skin'])
        File.write(output_filename, str)
      end
      if File.exists?(output_filename)
        puts "  found output"
        # upload variant if output file exists
        variant_path = "#{symbol.settings['image_url']}.variant-#{tone}.#{ext}"
        params = S3Bucket.remote_upload_params(variant_path, content_type)
        post_params = params[:upload_params]
        post_params[:file] = File.open(output_filename, 'rb')      
        # upload to s3 from tempfile
        res = Typhoeus.post(params[:upload_url], body: post_params)
        if res.success?
          puts "  uploaded variant #{tone}"
          if ext == 'svg'
            puts "    rasterizing..."
            raster = ColorShift.rasterize(variant_path, output_filename)
            puts "    #{raster[:success] ? 'done!' : 'failed!'}"
          end
        else
          puts "  upload failed"
          puts res.body
          success = false
          errors << symbol
        end

        # remove output file
        File.unlink(output_filename)
      else
        puts "  no output found"
        success = false
      end
    end
    if known_source && success
      puts "  variant files successfully uploaded"
      if !symbol.settings['image_url'].match(/\.varianted-skin\.\w+$/)
        # change to a filename that ends with .varianted-skin.ext so all
        # consumers can easily know if there are variants without lookup
        params = S3Bucket.remote_upload_params("#{symbol.settings['image_url']}.varianted-skin.#{ext}", content_type)
        post_params = params[:upload_params]
        post_params[:file] = File.open(output_filename, 'rb')      
        res = Typhoeus.post(params[:upload_url], body: post_params)
        if res.success?
          symbol.settings['image_url'] += ".varianted-skin.#{ext}"
          puts "    url is now variant-flagged"
        else
          puts "    VARIANT FLAG FAILED"
          success = false
        end
      end
      if success    
        symbol.settings['has_skin'] = true
        symbol.settings['has_variants'] = true
        symbol.save
      end
    elsif known_source
      puts "  no variant files generated or uploaded"
      symbol.settings['has_skin'] = false
      symbol.save_without_indexing
    else
      puts "  not a recognized repo: #{source}"
    end
  end

  def self.rasterize(path, local_path=nil)
    puts "rasterizing #{path}"
    url = "#{ENV['S3_CDN']}/#{path}"
    if !local_path || !File.exist?(local_path)
      # download the image
      file = Tempfile.new(["stash", '.svg'])
      file.binmode
      res = Typhoeus.get(URI.escape(url), followlocation: true)
      file.write(res.body)
      # convert it locally
      begin
        Timeout::timeout(5) do
          `convert -background none -density 300 -resize 400x400 -gravity center -extent 400x400 #{local_path} #{local_path}.raster.png`
        end
      rescue Timeout::Error
        puts "  rasterizing error, took too long"
      end
      # upload the rasterized version
      file.close
      local_path = file.path
    end

    params = remote_upload_params("#{symbol['path']}.raster.png", 'image/png')
    post_params = params[:upload_params]
    if File.exist?("#{local_path}.raster.png")
      post_params[:file] = File.open("#{local_path}.raster.png", 'rb')
  
      # upload to s3 from tempfile
      res = Typhoeus.post(params[:upload_url], body: post_params)
      if res.success?
        return {success: true}
      else
        return {error: true}
      end
    else
      return {error: true}
    end  
  end
end

# ARASAAC
# convert file.png txt:- | grep F7E7E0
# convert file.png -fill "#SKIN" -fuzz 30% -floodfill +XX+YYY "#f7e7e0" intermediate.png

# Mulberry
# skin: FFEEC8


# Tawasol
# skin: c4996c

# Twemoji
# light: f7dece
# medium: d5ab88
# medium-dark: af7e57
# dark: 7c533e

# SymbolStix
# skin: e4bc96

# PCS
# skin: ffaf80
# mdeium skin: cf976d