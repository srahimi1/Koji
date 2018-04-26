class Player < ApplicationRecord
	validates :email, uniqueness: true
	validates :cellphone, uniqueness: true
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

    def self.create_and_send_confirmation_codes(id)
    	player = Player.find(id)
    	email = player.email
    	cellphone = player.cellphone
    	PlayerMailer.send_cellphone_confirmation(cellphone, "1232A")
    end
end
