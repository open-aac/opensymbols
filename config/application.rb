require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

if !ENV['SECURE_ENCRYPTION_KEY'] || !Rails.env.production?
  require 'dotenv'
  Dotenv.load if defined?(Dotenv)
end

module OpenSymbols2
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.eager_load_paths += %W(#{config.root}/lib)
  end
end
