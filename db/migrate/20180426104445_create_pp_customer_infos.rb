class CreatePpCustomerInfos < ActiveRecord::Migration[5.1]
  def change
    create_table :pp_customer_infos do |t|
      t.references :player
      t.references :payment_provider
      t.string :pp_customer_id

      t.timestamps
    end
  end
end
