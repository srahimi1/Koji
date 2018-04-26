class PlayersController < ApplicationController
	def create
	end

	def check_email
		puts "these are the two emails"
		data = params["data"]
		puts data
		data = URI.decode(params['data'])
		puts data
	end

	def check_cellphone
		puts "these are the two cellphones"
		data = params["data"]
		puts data
		data = URI.decode(params['data'])
		puts data
	end

	def check_displayname
		puts "these are the two displaynames"
		data = params["data"]
		puts data
		data = URI.decode(params['data'])
		puts data
	end
end
