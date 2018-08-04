require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App1
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1
    config.action_dispatch.default_headers = {
    	"Access-Control-Allow-Origin" => "*",
      	"Access-Control-Allow-Methods" => "OPTIONS, GET, POST, PATCH, PUT, DELETE",
      	"Access-Control-Allow-Headers" => "X-PINGOTHER, Content-Type",
      	"Access-Control-Max-Age" => "86400"
    }
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
  end
end
