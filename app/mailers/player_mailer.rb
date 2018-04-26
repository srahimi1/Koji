class PlayerMailer < ApplicationMailer

	def send_cellphone_confirmation(num, code)
		add = num.to_s+"@vtext.com"
		puts "this is the address"
		puts add
		message = "your koji confirmation code is "+code.to_s
		mail(from: "kojigame.com", to: add, subject: "", body: message)
	end
end
