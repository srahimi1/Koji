class GooglePlaySubscriptionsController < ApplicationController
	require "net/http"
	require "uri"


	def get_access_and_refresh_tokens
		res = GooglePlaySubscription.get_access_and_refresh_tokens(params["code"].to_s)
		render plain: res["refresh_token"]
	end

	
	def get_access_token_from_refresh_token
		return GooglePlaySubscription.get_access_token_from_refresh_token
	end

	def subscribe_with_google_play
		render plain: GooglePlaySubscription.subscribe_with_google_play(params["purchaseToken"], params["receipt"], params["email"], params["packageName"], params["subsID"])
	end

end