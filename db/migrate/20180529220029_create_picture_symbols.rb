class CreatePictureSymbols < ActiveRecord::Migration[5.0]
  def change
    create_table :picture_symbols do |t|
      t.text :settings
      t.integer :random
      t.string :repo_key
      t.string :symbol_key
      t.boolean :enabled
      t.timestamps
    end
    add_index :picture_symbols, [:enabled]
    add_index :picture_symbols, [:repo_key, :symbol_key], :unique => true
  end
end
