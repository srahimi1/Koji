class GamesController < ApplicationController
  
  def create
      if (session["player_id"] != nil)
        @player = Player.find(session[:player_id])
      else 
        @player = Player.find(0)
      end
      @game = @player.games.new(score: 0)
  		if (!session["player_id"].blank? && !@player.blank?)
        @response = @game.start_new_game
        puts " "
        puts " "
        puts "started new, not demo, game"
        puts " "
        puts " "
      else
        @response = @game.start_new_demo_game
        puts " "
        puts " "
        puts "started demo game"
        puts " "
        puts " "
      end
      @game.game_data = JSON.generate(@response)
      @game.save
      session["game_id"] = @game.id
      @response["gameID"] = @game.id
      headers["Access-Control-Allow-Origin"] = "*"
      headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH"
      headers["Access-Control-Allow-Headers"] = "X-PINGOTHER, Content-Type"
      headers["Access-Control-Max-Age"] = "86400"
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
