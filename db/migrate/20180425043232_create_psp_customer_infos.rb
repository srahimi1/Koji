class CreatePspCustomerInfos < ActiveRecord::Migration[5.1]
  def change
    create_table :psp_customer_infos do |t|
      t.references :player, foreign_key: true
      t.references :payment_provider, foreign_key: true
      t.string :psp_customer_id

      t.timestamps
    end
  end
end
