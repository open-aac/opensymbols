# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20220201183159) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "external_sources", force: :cascade do |t|
    t.text     "settings"
    t.string   "token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["token"], name: "index_external_sources_on_token", unique: true, using: :btree
  end

  create_table "picture_symbols", force: :cascade do |t|
    t.text     "settings"
    t.integer  "random"
    t.string   "repo_key"
    t.string   "symbol_key"
    t.boolean  "enabled"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.boolean  "has_skin"
    t.boolean  "unsafe_result"
    t.index ["enabled"], name: "index_picture_symbols_on_enabled", using: :btree
    t.index ["random"], name: "index_picture_symbols_on_random", using: :btree
    t.index ["repo_key", "has_skin"], name: "index_picture_symbols_on_repo_key_and_has_skin", using: :btree
    t.index ["repo_key", "symbol_key"], name: "index_picture_symbols_on_repo_key_and_symbol_key", unique: true, using: :btree
    t.index ["repo_key", "unsafe_result"], name: "index_picture_symbols_on_repo_key_and_unsafe_result", using: :btree
  end

  create_table "repository_modifiers", force: :cascade do |t|
    t.integer  "symbol_repository_id"
    t.string   "locale"
    t.string   "repo_key"
    t.text     "settings"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.index ["symbol_repository_id", "locale"], name: "index_repository_modifiers_on_symbol_repository_id_and_locale", unique: true, using: :btree
  end

  create_table "symbol_repositories", force: :cascade do |t|
    t.string   "repo_key"
    t.text     "settings"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["repo_key"], name: "index_symbol_repositories_on_repo_key", unique: true, using: :btree
  end

  create_table "symbol_requests", force: :cascade do |t|
    t.text     "settings"
    t.string   "phrase"
    t.string   "locale"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["locale", "phrase"], name: "index_symbol_requests_on_locale_and_phrase", using: :btree
  end

end
