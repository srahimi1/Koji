class CreatePpCustomerInfos < ActiveRecord::Migration[5.1]
  def change
    create_table :pp_customer_infos do |t|
      t.references :player, foreign_key: true
      t.references :payment_provider, foreign_key: true
      t.string :pp_customer_id

      t.timestamps
    end
  end
end
