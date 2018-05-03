class PlayersController < ApplicationController

	def create
		cellValid = Player.validate_cellphone(params["cellphone"])
		emailValid = Player.validate_email(params["email"])
		if (cellValid && emailValid && (params["password1"].to_s == params["password2"].to_s))
			player = Player.new(email: params["email"].to_s.downcase, cellphone: params["cellphone"].to_s, display_name: params["display_name"], password: params["password1"], phone_country: "USA", game_version: params["game_version"], subscribed: 0, email_verified: 0, cellphone_verified: 0)
			if player.save
				player.player_gaming_histories.create(current_total: 0, current_high_score: 0, history: "")
				Thread.new { 
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "vtext.com").deliver_now
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "tmomail.net").deliver_now
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "txt.att.net").deliver_now
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "messaging.sprintpcs.com").deliver_now
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "txt.att.net").deliver_now
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "vmobl.com").deliver_now
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "myboostmobile.com").deliver_now
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "mymetropcs.com").deliver_now
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "page.nextel.com").deliver_now
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "email.uscc.net").deliver_now
					PlayerMailer.send_confirmation_text(player.cellphone, "1234zz", "sms.mycricket.com").deliver_now
					PlayerMailer.send_confirmation_email(player.email, "1234zz").deliver_now
				}
				ActiveRecord::Base.connection.close
				render plain: "OK"
			end
		end
	end
	
	def login
		@player = nil
		if (!params["email"].blank?)
			@player = Player.find_by(email: params["email"].to_s.downcase)
		elsif (!params["cellphone"].blank?)
			@player = Player.find_by(cellphone: params["cellphone"].to_s)
		end

		if(!@player.blank?)
			if (params[:password] == @player.password)
				session["player_id"] = @player.id
				render plain: "OK"
			else
				render plain: "BAD"
			end
		else
			render plain: "BAD"
		end
	end

	def check_email
		player = Player.find_by(email: params["data"].to_s.downcase)
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
