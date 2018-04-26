class PlayerMailer < ApplicationMailer

	def self.send_cellphone_confirmation(num, code)
		player
		add = num.to_s+"@vtext.com"
		message = "your koji confirmation code is "+code.to_s
		mail(to: add, subject: "koji confirmation code") do |format|
			format.text {render plain: message}
		end
	end
end
