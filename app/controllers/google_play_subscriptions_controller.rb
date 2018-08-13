class GooglePlaySubscriptionsController < ApplicationController
	require "net/http"
	require "uri"


	def get_access_and_refresh_tokens
		params2 = {grant_type: "authorization_code", code: params["code"].to_s, client_id: ENV["GOOGLE_PLAY_CLIENT_ID"], client_secret: ENV["GOOGLE_PLAY_CLIENT_SECRET"], redirect_uri: "http://arsr-app1.herokuapp.com/googleplaysubscriptions/getAccessAndRefreshTokens"}
		x = Net::HTTP.post_form(URI.parse("https://accounts.google.com/o/oauth2/token"),params2)
		res = JSON.parse(x.body)
		puts "this is the refre toke"
		puts " "
		puts res["refresh_token"]
		puts " "
		puts " "
		render plain: res["refresh_token"]
	end

	
	def get_access_token_from_refresh_token
		params2 = {grant_type: "refresh_token", client_id: ENV["GOOGLE_PLAY_CLIENT_ID"], client_secret: ENV["GOOGLE_PLAY_CLIENT_SECRET"], refresh_token: ENV["GOOGLE_PLAY_REFRESH_TOKEN"]}
		x = Net::HTTP.post_form(URI.parse("https://accounts.google.com/o/oauth2/token"),params2)
	end

	def subscribe_with_google_play
		at = get_access_token_from_refresh_token
		render plain: "IT made it!!!!!!"
	end

end