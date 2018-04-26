class PlayerMailer < ApplicationMailer

	def send_cellphone_confirmation(num, code)
		add = num.to_s+"@vtext.com"
		message = "your koji confirmation code is "+code.to_s
		mail(from: "kojigame.com", to: add, subject: "koji confirmation code", body: message)
	end
end
