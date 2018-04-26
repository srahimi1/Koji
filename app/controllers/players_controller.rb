class PlayersController < ApplicationController

	def create
		cellValid = Player.validate_cellphone(params["cellphone"])
		emailValid = Player.validate_email(params["email"])
		if (cellValid && emailValid)
			player = Player.new(email: params["email"], cellphone: params["cellphone"], display_name: params["display_name"], phone_country: "USA", game_version: params["game_version"], subscribed: 0, email_verified: 0, cellphone_verified: 0)
			if player.save
				puts "player saved"
				Player.create_and_send_confirmation_codes(player.id)
			end
		end
	end
	
	def check_email
		player = Player.find_by(email: params["data"])
		output = ""
		if (!player) 
			output = "OK"
		elsif (!!player) 
			output = "DUPLICATE" 
		end
		render plain: output
	end

	def check_cellphone
		player = Player.find_by(cellphone: params["data"].to_s)
		output = ""
		if (!player) 
			output = "OK"
		elsif (!!player) 
			output = "DUPLICATE" 
		end
		render plain: output
	end

	def check_displayname
		player = Player.find_by(display_name: params["data"])
		output = ""
		if (!player) 
			output = "OK"
		elsif (!!player) 
			output = "DUPLICATE" 
		end
		render plain: output
	end

	def startup_message
		render plain: "GOOD JOB!"
	end

  def player_params
    params.require(:player).permit(:email, :cellphone, :displayname)
  end

end
