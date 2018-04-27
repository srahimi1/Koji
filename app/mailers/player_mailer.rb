class PlayerMailer < ApplicationMailer

	def send_confirmation_text(num, code, provider)
		add = num.to_s+"@"+provider
		message = "Your Koji confirmation code is "+code.to_s
		mail(from: "", subject: "", to: add, body: message)
	end

	def send_confirmation_email(email, code)
		message = "Thank you for signing up to play Koji. Your Koji confirmation code is "+code.to_s
		mail(from: "kojigame.com", to: email, subject: "kojigame confirmation code", body: message)
	end
end
