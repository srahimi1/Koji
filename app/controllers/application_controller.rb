class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_filter :set_access
end
