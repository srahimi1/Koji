class GamesController < ApplicationController
  
  def create
      if (!params["session_token"].blank? && !params["session_token"].to_s.blank? && (params["session_token"].to_s != "0") && (params["session_token"].to_s != "") )
        @player = Player.find_by(session_token: params["session_token"].to_s)
      else 
        @player = Player.find(0)
      end
      @game = @player.games.new(score: 0)
      if (!params["session_token"].blank? && (params["session_token"].to_s != "0") && !@player.blank? && @player.logged_in)
        @response = @game.start_new_game
      else
        @response = @game.start_new_demo_game
      end
      @game.game_data = JSON.generate(@response)
      @game.save
      @response["gameID"] = @game.id
      render json: @response
  end

  def update
    update_gaming_history = false
    if (!params[:id].blank? && (params[:id].to_s != "0"))
      @game = Game.find(params[:id])
    else
      @game = Game.find(params[:id])
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
    head :no_content
  end

  private
  	def game_params
  		params.require(:game).permit(:username)
  	end

    def current_player
      @current_player ||= session[:player_id] && Player.find(session[:player_id])
    end
end
