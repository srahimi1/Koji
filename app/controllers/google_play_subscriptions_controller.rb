class GooglePlaySubscriptionsController < ApplicationController
	require "net/http"
	require "uri"


	def get_access_and_refresh_tokens
		params2 = {grant_type: "authorization_code", code: params[:code], client_id: "29709825761-lg7lau2323objqt0lrg5mikohjbcjijl.apps.googleusercontent.com", client_secret: "wOc9rMIMupQXDkyPd6iXg_ur", redirect_uri: "http://arsr-app1.herokuapp.com/googleplaysubscriptions/getAccessAndRefreshTokens"}
		x = Net::HTTP.post_form(URI.parse("https://accounts.google.com/o/oauth2/token"),params2)
		render plain: x.body.inspect
	end

	def subscribe_with_google_play
		render plain: "IT made it!!!!!!"
	end

end