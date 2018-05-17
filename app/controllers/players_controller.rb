class PlayersController < ApplicationController

	def create
		if (params["email"].blank?)
			@email = nil 
			emailValid = true
		else
			@email = params["email"].to_s.downcase
			emailValid = Player.validate_email(params["email"])
		end
		if (params["cellphone"].blank?) 
			@cell = nil
			cellValid = true
		else
			@cell = params["cellphone"].to_s
			cellValid = Player.validate_cellphone(params["cellphone"])
		end
		output = "BAD"
		if (cellValid && emailValid && (params["password1"].to_s == params["password2"].to_s) && (!params["email"].blank? || !params["cellphone"].blank?))
			player = Player.new(email: @email, cellphone: @cell, display_name: params["display_name"], password: params["password1"], phone_country: "USA", game_version: params["game_version"], subscribed: 0, email_verified: 0, cellphone_verified: 0)
			if (player.save! && !player.id.blank?)
				player.create_player_gaming_history(current_total: 0, current_high_score: 0, history: "")
				email_confirmation_code = ConfirmationCode.make_code(player.id, 0)
				cellphone_confirmation_code = ConfirmationCode.make_code(player.id, 1)
				Thread.new { 
					if (!params["cellphone"].blank?)
						PlayerMailer.send_confirmation_text(player.cellphone, cellphone_confirmation_code, "vtext.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, cellphone_confirmation_code, "tmomail.net").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, cellphone_confirmation_code, "txt.att.net").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, cellphone_confirmation_code, "messaging.sprintpcs.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, cellphone_confirmation_code, "vmobl.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, cellphone_confirmation_code, "myboostmobile.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, cellphone_confirmation_code, "mymetropcs.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, cellphone_confirmation_code, "page.nextel.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, cellphone_confirmation_code, "email.uscc.net").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, cellphone_confirmation_code, "sms.mycricket.com").deliver_now
					end
					if (!params["email"].blank?)
						PlayerMailer.send_confirmation_email(player.email, email_confirmation_code).deliver_now
					end
				}
				output = "OK"
			end
		end
		ActiveRecord::Base.connection.close
		render plain: output
	end

	def update
		player = Player.find(session["player_id"])
		if (params["code"].to_i == 1)
			player.password = params["password"]
		elsif (params["code"].to_i == 2)
			if (!params["email"].blank? && !Player.find_by(email: params[:email]))
				player.email = params["email"].to_s.downcase
			end
			if (!params["cellphone"].blank? && !Player.find_by(cellphone: params[:cellphone]))
				player.cellphone = params["cellphone"]
			end
		elsif (params["code"].to_i == 3)
			Player.cancel_membership
		elsif (params["code"].to_i == 4)
			session[:player_id] = nil
		end 
		output = "BAD"
		if player.save!
			output = "OK"
		end
		render plain: output
	end

	def login
		@player = nil
		output = "BAD"
		if (!params["email"].blank?)
			@player = Player.find_by(email: params["email"].to_s.downcase)
		elsif (!params["cellphone"].blank?)
			@player = Player.find_by(cellphone: params["cellphone"].to_s)
		end

		if(!@player.blank?)
			if (params[:password] == @player.password)
				session["player_id"] = @player.id
				output = "OK"
			end
		end
		render plain: output
	end

	def show
		player = Player.find(session["player_id"])
		history = PlayerGamingHistory.find_by(player_id: session["player_id"]).history
		response = {}
		response["email"] = player.email
		response["cellphone"] = player.cellphone
		if (!history.blank?)
			response["history"] = JSON.parse(history)
		else
			response["history"] = ""
		end
		res = JSON.generate(response)
		output = "OK_?*#{res}"
		render plain: output
	end

	def check_email
		player = Player.find_by(email: params["data"].to_s.downcase)
		output = "DUPLICATE"
		if (!player) 
			output = "OK"
		end
		render plain: output
	end

	def check_cellphone
		player = Player.find_by(cellphone: params["data"].to_s)
		output = "DUPLICATE"
		if (!player) 
			output = "OK" 
		end
		render plain: output
	end

	def check_displayname
		player = Player.find_by(display_name: params["data"])
		output = "DUPLICATE"
		if (!player) 
			output = "OK"
		end
		render plain: output
	end

	def startup_message
		render plain: "1"
	end

  def player_params
    params.require(:player).permit(:email, :cellphone, :displayname)
  end

end
