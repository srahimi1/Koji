class CreatePayementServiceProviders < ActiveRecord::Migration[5.1]
  def change
    create_table :payement_service_providers do |t|
      t.string :name
      t.string :main_url
      t.string :account_number
      t.string :api_key
      t.integer :current_active

      t.timestamps
    end
  end
end