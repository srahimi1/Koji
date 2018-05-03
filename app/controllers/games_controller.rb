class GamesController < ApplicationController
  def create
      if (session["player_id"] != nil)
        @player = Player.find(session[:player_id])
      else 
        @player = Player.find(0)
      end
      @game = @player.games.create(score: 0)
  		@response = @game.start_new_game
      @game.game_data = JSON.generate(@response)
      @game.save
      session["game_id"] = @game.id
      @response["gameID"] = @game.id
      puts session["game_id"]
  		render json: @response
  end

  def update
    update_gaming_history = false
    if (!session["game_id"].blank?)
      @game = Game.find(session["game_id"])
    end
    if (@response.blank?)
      @response = JSON.parse(@game.game_data)
    end   
    if (!params[:numberOfX].blank?)
      @response["numberOfX"] = params[:numberOfX]
    end
    if (!params[:points].blank?)
      @response["points"] = params[:points]
      @game.score = params[:points].to_i
    end
    if (!params[:won].blank?)
      @game.won = params[:won].to_i
      if ( (params[:won].to_i == 1) || (params[:won].to_i == 2) ) 
        update_gaming_history = true 
      end
    end
    @game.game_data = JSON.generate(@response)
    @game.save
    if ( (@game.player_id != 0) && update_gaming_history) 
      PlayerGamingHistory.update(@game)
    end
  end

  def current_player
    @current_player ||= session[:player_id] && Player.find(session[:player_id])
  end

  private
  	def game_params
  		params.require(:game).permit(:username)
  	end
end
