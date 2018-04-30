class PlayerMailer < ApplicationMailer

	def send_confirmation_text(num, code, provider)
		@code = code
		add = num.to_s+"@"+provider
		mail(from: "Kojigame.com", subject: "", to: add)
	end

	def send_confirmation_email(email, code)
		@code = code
		mail(from: "kojigame.com", to: email, subject: "kojigame confirmation code")
	end
end
