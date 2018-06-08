class CreateDeletedPlayers < ActiveRecord::Migration[5.1]
  def change
    create_table :deleted_players do |t|
      t.bigint :player_id
      t.string :email
      t.string :cellphone
    end
  end
end
