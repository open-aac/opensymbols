class CreateRepositoryModifiers < ActiveRecord::Migration[5.0]
  def change
    create_table :repository_modifiers do |t|
      t.integer :symbol_repository_id
      t.string :locale
      t.string :repo_key
      t.text :settings
      t.timestamps
    end
    add_index :repository_modifiers, [:symbol_repository_id, :locale], :unique => true
  end
end
