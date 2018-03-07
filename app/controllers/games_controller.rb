class GamesController < ApplicationController
  def create
  	@user = User.where(username: params[:username])
  	if @user
	  	@game = Game.new(user_id: @user.id)
  		@game.create_answer
  		@game.create_palette
  		@game.set_timer_intial
  		@game.create_avg_time_for_game
  		@game.save
  	end
  end

  def old
  end

  private
  	def game_params
  		params.require(:game).permit(:username)
  	end
end
