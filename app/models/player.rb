class Player < ApplicationRecord
	validates :email, uniqueness: true
	validates :cellphone, uniqueness: true
	validates :display_name, uniqueness: true

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
end
