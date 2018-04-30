class PlayerMailer < ApplicationMailer

	def send_confirmation_text(num, code, provider)
		@code = code
		add = num.to_s+"@"+provider
		mail(from: "Kojigame.com", subject: "", to: add)
	end

	def send_confirmation_email(email, code)
		message = "Thank you for signing up to play Koji. Your Koji confirmation code is "+code.to_s
		mail(from: "kojigame.com", to: email, subject: "kojigame confirmation code", body: message)
	end
end
