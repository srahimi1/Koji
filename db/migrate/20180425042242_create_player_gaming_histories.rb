class CreatePlayerGamingHistories < ActiveRecord::Migration[5.1]
  def change
    create_table :player_gaming_histories do |t|
      t.references :player, foreign_key: true
      t.integer :current_total
      t.integer :current_high_score
      t.text :history

      t.timestamps
    end
  end
end
