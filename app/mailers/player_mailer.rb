class PlayerMailer < ApplicationMailer

	def send_confirmation_text(num, code, provider)
		@code = code
		add = num.to_s+"@"+provider
		mail(from: "sendgrid.net", subject: "", to: add)
	end

	def send_confirmation_email(email, code)
		@code = code
		mail(from: "sendgrid.net", to: email, subject: "kojigame confirmation code")
	end
end
