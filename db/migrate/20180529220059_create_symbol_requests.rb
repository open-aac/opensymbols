class CreateSymbolRequests < ActiveRecord::Migration[5.0]
  def change
    create_table :symbol_requests do |t|
      t.text :settings
      t.string :phrase
      t.string :locale
      t.timestamps
    end
    add_index :symbol_requests, [:locale, :phrase]
  end
end
