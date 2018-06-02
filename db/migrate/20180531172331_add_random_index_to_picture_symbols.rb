class AddRandomIndexToPictureSymbols < ActiveRecord::Migration[5.0]
  def change
    add_index :picture_symbols, :random
  end
end
