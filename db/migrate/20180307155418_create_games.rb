class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
      t.integer :user_id
      t.text :answer
      t.text :palette
      t.integer :timer
      t.integer :avg_time_for_game
      t.boolean :won_bool

      t.timestamps
    end
  end
end
