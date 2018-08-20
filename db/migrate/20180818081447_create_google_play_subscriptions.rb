class CreateGooglePlaySubscriptions < ActiveRecord::Migration[5.1]
  def change
    create_table :google_play_subscriptions do |t|
      t.bigint :player_id
      t.string :email
      t.string :package_name
      t.string :subscription_id
      t.text :order_id
      t.text :purchase_token
      t.string :product_id
      t.string :kind
      t.string :start_time_millis
      t.string :expiry_time_millis
      t.string :price_amount_micros
      t.string :payment_state
      t.string :cancel_reason
      t.string :user_cancellation_time_millis
      t.integer :status
      t.string :status_description
      t.timestamps
    end
  end
end