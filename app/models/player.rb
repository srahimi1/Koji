class Player < ApplicationRecord
	require 'securerandom'

	has_many :games, dependent: :destroy
	has_one :player_gaming_history, dependent: :destroy
	has_many :confirmation_codes, dependent: :destroy
	has_one :pp_customer_info
	has_one :subscription

	validates :email, uniqueness: true, allow_nil: true
	validates :cellphone, uniqueness: true, allow_nil: true
	validates :display_name, uniqueness: true
	require 'mail'

	def self.validate_cellphone(num)
		cellphone = num.to_s
		valid = true
		if (cellphone.length == 10)
			10.times do |i|
				if (!self.is_number?(cellphone[i]))
					valid = false
					break
				end
			end
		else
			valid = false
		end
		return valid
	end

	def self.is_number?(obj)
        obj.to_s == obj.to_i.to_s
    end

    def self.validate_email(email)
    	valid = true
    	a = Mail::Address.new(email)
    	rescue Mail::Field::ParseError
    		return false
    	else
    		return true
    end

    def self.cancel_membership(player_id)
    	subscription = Subscription.find_by(player_id: player_id)
    	result = Subscription.cancel_subscription(subscription.pp_subscription_id)
    	if (result == 1)
    		subscription.status = 3
    		subscription.status_description = "cancelled"
    		subscription.save
    	end
    	return result
    end

    def self.send_password_reset_confirmation_code(player_id, cellphone, email)
    	player = Player.find(player_id)
    	confirmation_code = ConfirmationCode.make_code(player_id, 0)
    	#email_confirmation_code = ConfirmationCode.make_code(player_id, 0)
		#cellphone_confirmation_code = ConfirmationCode.make_code(player_id, 1)
		Thread.new { 
			if (!cellphone.blank?)
				PlayerMailer.send_confirmation_text(player.cellphone, confirmation_code, "vtext.com").deliver_now   #all these used to be cellphone_confirmation_code, not confirmation_code
				PlayerMailer.send_confirmation_text(player.cellphone, confirmation_code, "tmomail.net").deliver_now
				PlayerMailer.send_confirmation_text(player.cellphone, confirmation_code, "txt.att.net").deliver_now
				PlayerMailer.send_confirmation_text(player.cellphone, confirmation_code, "messaging.sprintpcs.com").deliver_now
				PlayerMailer.send_confirmation_text(player.cellphone, confirmation_code, "vmobl.com").deliver_now
				PlayerMailer.send_confirmation_text(player.cellphone, confirmation_code, "myboostmobile.com").deliver_now
				PlayerMailer.send_confirmation_text(player.cellphone, confirmation_code, "mymetropcs.com").deliver_now
				PlayerMailer.send_confirmation_text(player.cellphone, confirmation_code, "page.nextel.com").deliver_now
				PlayerMailer.send_confirmation_text(player.cellphone, confirmation_code, "email.uscc.net").deliver_now
				PlayerMailer.send_confirmation_text(player.cellphone, confirmation_code, "sms.mycricket.com").deliver_now
			end
			if (!email.blank?)
				PlayerMailer.send_confirmation_email(player.email, confirmation_code).deliver_now #all these used to be email_confirmation_code, not confirmation_code
			end
		}
		ActiveRecord::Base.connection.close
    end

    def self.create_session_token
    	token = SecureRandom.urlsafe_base64(16, false)
    	player = Player.find_by(session_token: token)
    	while !player.blank?
    		token = SecureRandom.urlsafe_base64(16, false)
    		player = Player.find_by(session_token: token)
    	end
    	return token
    end


end
