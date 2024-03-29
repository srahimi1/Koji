class CreatePlayers < ActiveRecord::Migration[5.1]
  def change
    create_table :players do |t|
      t.string :email, index: {unique: true}
      t.string :cellphone, index: {unique: true}
      t.string :display_name, index: {unique: true}
      t.string :phone_country
      t.string :password
      t.string :game_version
      t.integer :subscribed
      t.bigint :subscription_id
      t.bigint :google_play_subscription_id
      t.timestamp :date_first_subscribed
      t.integer :email_verified
      t.integer :cellphone_verified
      t.string :session_token
      t.boolean :logged_in
      t.timestamps
    end
  end
end