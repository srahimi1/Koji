class CreateSubscriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :subscriptions do |t|
      t.references :player, foreign_key: true
      t.timestamp :date_first_subscribed
      t.string :pp_subscription_id
      t.integer :status
      t.string :status_description
      t.timestamp :date_last_charged
      t.references :payment_provider, foreign_key: true
      t.string :pp_player_id
      t.string :most_recent_transaction_confirmation_number
      t.text :payment_history

      t.timestamps
    end
  end
end
