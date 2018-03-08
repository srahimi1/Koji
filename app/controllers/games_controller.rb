class GamesController < ApplicationController
  def create
	  	@game = Game.new
  		response = @game.create_colors
  		render json: response
  end

  def old
  end

  private
  	def game_params
  		params.require(:game).permit(:username)
  	end
end
