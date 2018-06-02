class CreateExternalSources < ActiveRecord::Migration[5.0]
  def change
    create_table :external_sources do |t|
      t.text :settings
      t.string :token
      t.timestamps
    end
    add_index :external_sources, [:token], :unique => true
  end
end
