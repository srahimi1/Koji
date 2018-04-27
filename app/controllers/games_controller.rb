class GamesController < ApplicationController
  def create
      if (session["id"] != nil)
        player = Player.find(session[:id])
      else 
        player = Player.find(0)
      end
      @game = player.games.create(score: 0)
  		response = @game.start_new_game
      @game.game_data = JSON.generate(response)
      @game.save
      session["game_id"] = @game.id
      response["gameID"] = @game.id
      puts session["game_id"]
  		render json: response
  end

  def update
  end

  def current_player
    @current_player ||= session[:id] && Player.find(session[:id])
  end

  private
  	def game_params
  		params.require(:game).permit(:username)
  	end
end
