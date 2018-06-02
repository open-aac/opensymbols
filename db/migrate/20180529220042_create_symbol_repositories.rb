class CreateSymbolRepositories < ActiveRecord::Migration[5.0]
  def change
    create_table :symbol_repositories do |t|
      t.string :repo_key
      t.text :settings
      t.timestamps
    end
    add_index :symbol_repositories, [:repo_key], :unique => true
  end
end
