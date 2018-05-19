# Load the Rails application.
require_relative 'application'

# Initialize the Rails application.
Rails.application.initialize!

ActionMailer::Base.smtp_settings = {
  :user_name => ENV['SENDGRID_USERNAME'],
  :password => ENV['SENDGRID_PASSWORD'],
  :domain => 'sendgrid.net',
  :address => 'smtp.sendgrid.net',
  :port => 587,
  :authentication => :plain,
  :enable_starttls_auto => true
}

ENV['STRIPE_PUBLISHABLE_KEY'] = 'pk_test_ZMMqCmUQPkC2QjqkA6ZknBg7'
ENV['STRIPE_SECRET_KEY'] = 'sk_test_IKTtVCpDqEbM7GV8WVY56ADM'