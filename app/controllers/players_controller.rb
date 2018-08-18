class PlayersController < ApplicationController

	def create
		if (params["email"].blank?)
			@email = nil 
			emailValid = false
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
			player = Player.new(email: @email, cellphone: @cell, display_name: params["display_name"], password: params["password1"], phone_country: "USA", game_version: params["game_version"], subscribed: 0, email_verified: 0, cellphone_verified: 0, session_token: "", logged_in: false)
			subscription_result = GooglePlaySubscription.subscribe_with_google_play(params["purchaseToken"], params["receipt"], @email)
			if ((subscription_result != -1) && player.save && !player.id.blank?)
				subs = GooglePlaySubscription.find(subscription_result)
				player.create_player_gaming_history(current_total: 0, current_high_score: 0, history: "")
				player.subscribed = 1
				player.date_first_subscribed = DateTime.now
				player.create_pp_customer_info(payment_provider_id: 2, pp_customer_id: "order id: " + subs.order_id)
				player.session_token = Player.create_session_token
				player.logged_in = true
				player.save
				subs.player_id = player.id
				subs.save
				output = "OK:q:" + player.session_token
			elsif (subscription_result == -1)
				output = "BAD2"
			else
				output = "BAD"
			end
		end
		render plain: output
	end

	def update
		if ((!params[:id].blank?) && (params["code"].to_i != 1))
			player = Player.find_by(session_token: params[:id])
		end
		output = "BAD"
		destroyed = 0
		if (params["code"].to_i == 1)
			if (!params[:email].blank?)
				player = Player.find_by(email: params[:email].to_s.downcase)
			elsif (!params[:cellphone].blank?)
				player = Player.find_by(cellphone: params[:cellphone])
			end
			if (!player.blank?)
				cc = ConfirmationCode.find_by(player_id: player.id)
				if (!cc.blank? && (cc.code.to_s == params[:cc].to_s))
					player.password = params["password"]
					output = "RESET"
				end
			end
		elsif (!player.blank? && player.logged_in && (params["code"].to_i == 2))
			if (!params["email"].blank? && Player.find_by(email: params[:email]).blank? && Player.validate_email(params["email"]))
				player.email = params["email"].to_s.downcase
				output = "OK"
			end
			if (!params["cellphone"].blank? && Player.find_by(cellphone: params[:cellphone]).blank? && Player.validate_cellphone(params["cellphone"]))
				player.cellphone = params["cellphone"]
				output = "OK"
			end
		elsif (!player.blank? && player.logged_in && (params["code"].to_i == 3) && (params["cancel"].to_s.downcase == "cancel"))
			result = Player.cancel_membership(player.id)
			if (result == 1)
				DeletedPlayer.create(player_id: player.id, email: player.email, cellphone: player.cellphone) 
				player.destroy
				destroyed = 1
				output = "OK"
			end
		elsif (!player.blank? && params["code"].to_i == 4)
			player.session_token = ""
			player.logged_in = false
			player.save
			output = "OK"
		end 
		if ( (destroyed == 0) && !player.blank? && (!player.save) )
			output = "BAD"			
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

		if(!@player.blank? && (params[:reset].to_s == "0"))
			if (params[:password] == @player.password)
				@player.session_token = Player.create_session_token
				@player.logged_in = true
				@player.save
				output = "OK:q:" + @player.session_token
			end
		elsif (!@player.blank? && (params[:reset].to_s == "1"))
			Player.send_password_reset_confirmation_code(@player.id, params["cellphone"], params["email"])
			output = "RESET SENT"
		end
		render plain: output
	end

	def show
		output = ""
		if (!params[:id].blank? && !Player.find_by(session_token: params[:id]).blank? && Player.find_by(session_token: params[:id]).logged_in)
			player = Player.find_by(session_token: params[:id])
			pgh = PlayerGamingHistory.find_by(player_id: player.id)
			if !pgh.blank?
				history = pgh.history
			end
			response = {}
			if (!player.blank? && !player.email.blank?)
				response["email"] = player.email
			else
				response["email"] = ""
			end
			if (!player.blank? && !player.cellphone.blank?)
				response["cellphone"] = player.cellphone
			else
				response["cellphone"] = ""
			end
			if (!history.blank?)
				response["history"] = JSON.parse(history)
			else
				response["history"] = ""
			end
			res = JSON.generate(response)
			output = "OK_?*#{res}"
		else
			output = "BAD_?*"
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
		render plain: "1:q:" + form_authenticity_token
	end

  def player_params
    params.require(:player).permit(:email, :cellphone, :displayname)
  end

end