class PlayerGamingHistory < ApplicationRecord
  belongs_to :player

  def update(game)
  	history = PlayerGamingHistory.find_by(player_id: game.player_id)
  	game_date = Time.at(game.created_at).to_date
  	if (game_date === Time.at(history.updated_at).to_date)
  		history.current_total = history.current_total + game.score
  		if (game.score > history.current_high_score)
  			history.current_high_score = game.score
  		end
  	else
  		history.current_total = game.score
  		history.current_high_score = game.score
  	end
	temp_history = {}
	if (!history.history.blank?)
		temp_history = JSON.parse(history.history)
	end
	temp_history["#{game_date}"] = {:total => history.current_total, :high_score => history.current_high_score}  	
	history.history = JSON.generate(history.history)
	history.save
  end


end
