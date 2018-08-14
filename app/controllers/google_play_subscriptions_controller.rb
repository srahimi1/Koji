class GooglePlaySubscriptionsController < ApplicationController
	require "net/http"
	require "uri"


	def get_access_and_refresh_tokens
		params2 = {grant_type: "authorization_code", code: params["code"].to_s, client_id: ENV["GOOGLE_PLAY_CLIENT_ID"], client_secret: ENV["GOOGLE_PLAY_CLIENT_SECRET"], redirect_uri: "http://arsr-app1.herokuapp.com/googleplaysubscriptions/getAccessAndRefreshTokens"}
		x = Net::HTTP.post_form(URI.parse("https://accounts.google.com/o/oauth2/token"),params2)
		render plain: res["refresh_token"]
	end

	
	def get_access_token_from_refresh_token
		params2 = {grant_type: "refresh_token", client_id: ENV["GOOGLE_PLAY_CLIENT_ID"], client_secret: ENV["GOOGLE_PLAY_CLIENT_SECRET"], refresh_token: ENV["GOOGLE_PLAY_REFRESH_TOKEN"]}
		x = Net::HTTP.post_form(URI.parse("https://accounts.google.com/o/oauth2/token"),params2)
		res = JSON.parse(x.body)
		res["access_token"]
	end

	def subscribe_with_google_play
		at = get_access_token_from_refresh_token
		url = "https://www.googleapis.com/androidpublisher/v3/applications/com.kojigame.koji/purchases/subscriptions/sub1/tokens/" + params["purchaseToken"] + "?access_token=" + at
		res = Net::HTTP.get(URI.parse(url))
		puts " "
		puts " "
		puts "IT made it!!!!!!"
		puts " "
		puts res.body
		render plain: res.body
	end

end