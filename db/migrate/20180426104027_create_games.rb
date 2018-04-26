class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
     t.text :game_long_id
      t.references :player, foreign_key: true
      t.text :game_data
      t.integer :score
      t.timestamp :game_end_time
      t.integer :game_duration_seconds
      t.integer :won

      t.timestamps
    end
  end
end
