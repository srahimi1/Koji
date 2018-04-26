class Player < ApplicationRecord
	validates :email, uniqueness: true
	validates :cellphone, uniqueness: true
	validates :display_name, uniqueness: true
end
