class AddIndexesForSymbols < ActiveRecord::Migration[5.0]
  def change
    add_column :picture_symbols, :has_skin, :boolean
    add_index :picture_symbols, [:repo_key, :has_skin]
    add_column :picture_symbols, :unsafe_result, :boolean
    add_index :picture_symbols, [:repo_key, :unsafe_result]
  end
end
