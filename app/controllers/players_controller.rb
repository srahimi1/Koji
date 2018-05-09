class PlayersController < ApplicationController

	def create
		if (params["email"].blank?)
			@email = nil 
			emailValid = true;
		else
			@email = params["email"].to_s.downcase;
			emailValid = Player.validate_email(params["email"])
		end
		if (params["cellphone"].blank?) 
			@cell = nil
			cellValid = true;
		else
			@cell = params["cellphone"].to_s;
			cellValid = Player.validate_cellphone(params["cellphone"])
		end
		output = "BAD"
		if (cellValid && emailValid && (params["password1"].to_s == params["password2"].to_s) && (!params["email"].blank? || !params["cellphone"].blank?))
			player = Player.new(email: @email, cellphone: @cell, display_name: params["display_name"], password: params["password1"], phone_country: "USA", game_version: params["game_version"], subscribed: 0, email_verified: 0, cellphone_verified: 0)
			if (player.save! && !player.id.blank?)
				player.create_player_gaming_history(current_total: 0, current_high_score: 0, history: "")
				if (!params["cellphone"].blank?)
					Thread.new { 
						PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "vtext.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "tmomail.net").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "txt.att.net").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "messaging.sprintpcs.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "vmobl.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "myboostmobile.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "mymetropcs.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "page.nextel.com").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "email.uscc.net").deliver_now
						PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "sms.mycricket.com").deliver_now
					}
				end
				if (!params["email"].blank?)
					Thread.new {
						PlayerMailer.send_confirmation_email(player.email, "1234zz").deliver_now
					}
				end
				ActiveRecord::Base.connection.close
				output = "OK"
			end
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
		render plain: "GOOD JOB!"
	end

  def player_params
    params.require(:player).permit(:email, :cellphone, :displayname)
  end

end
