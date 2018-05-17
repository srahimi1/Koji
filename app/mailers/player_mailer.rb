class PlayerMailer < ApplicationMailer

	def send_confirmation_text(num, code, provider)
		@code = code
		add = num.to_s+"@"+provider
		body = "Your Koji cellphone confirmation code is: #{@code}"
		mail(from: "kojigame@sendgrid.net", subject: "", to: add, body: body, content_type: "text/plain")
	end

	def send_confirmation_email(email, code)
		@code = code
		mail(from: "kojigame@sendgrid.net", to: email, subject: "kojigame confirmation code")
	end
end
