class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.string :email
      t.text :message
      t.boolean :read
      t.boolean :replied

      t.timestamps
    end
  end
end
