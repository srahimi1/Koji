class MessagesController < ApplicationController

	def create
		output = "BAD"
		message = Message.new(email: params[:email], message: params[:message], read: false, replied: false)
		if message.save
			output = "OK"
		end		
		render plain: output
	end

end
