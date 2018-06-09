class CreatePaymentFailures < ActiveRecord::Migration[5.1]
  def change
    create_table :payment_failures do |t|
      t.string :email
      t.string :stripe_status
      t.string :stripe_type
      t.string :charge_id
      t.string :stripe_code
      t.string :decline_code
      t.string :message

      t.timestamps
    end
  end
end
