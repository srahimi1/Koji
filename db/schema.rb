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

ActiveRecord::Schema.define(version: 20180426104445) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "confirmation_codes", force: :cascade do |t|
    t.bigint "player_id"
    t.string "code"
    t.string "bymethod"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["player_id"], name: "index_confirmation_codes_on_player_id"
  end

  create_table "games", force: :cascade do |t|
    t.text "game_long_id"
    t.bigint "player_id"
    t.text "game_data"
    t.integer "score"
    t.datetime "game_end_time"
    t.integer "game_duration_seconds"
    t.integer "won"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["player_id"], name: "index_games_on_player_id"
  end

  create_table "payment_providers", force: :cascade do |t|
    t.string "name"
    t.string "main_url"
    t.string "account_number"
    t.string "api_key"
    t.integer "current_active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "player_gaming_histories", force: :cascade do |t|
    t.bigint "player_id"
    t.integer "current_total"
    t.integer "current_high_score"
    t.text "history"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["player_id"], name: "index_player_gaming_histories_on_player_id"
  end

  create_table "players", force: :cascade do |t|
    t.string "email"
    t.string "cellphone"
    t.string "display_name"
    t.string "phone_country"
    t.string "password"
    t.string "game_version"
    t.integer "subscribed"
    t.datetime "date_first_subscribed"
    t.integer "email_verified"
    t.integer "cellphone_verified"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cellphone"], name: "index_players_on_cellphone", unique: true
    t.index ["display_name"], name: "index_players_on_display_name", unique: true
    t.index ["email"], name: "index_players_on_email", unique: true
  end

  create_table "pp_customer_infos", force: :cascade do |t|
    t.bigint "player_id"
    t.bigint "payment_provider_id"
    t.string "psp_customer_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["payment_provider_id"], name: "index_pp_customer_infos_on_payment_provider_id"
    t.index ["player_id"], name: "index_pp_customer_infos_on_player_id"
  end

  create_table "subscriptions", force: :cascade do |t|
    t.bigint "player_id"
    t.datetime "date_first_subscribed"
    t.integer "status"
    t.string "status_description"
    t.datetime "date_last_charged"
    t.bigint "payment_provider_id"
    t.string "psp_player_id"
    t.string "most_recent_transaction_confirmation_number"
    t.text "payment_history"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["payment_provider_id"], name: "index_subscriptions_on_payment_provider_id"
    t.index ["player_id"], name: "index_subscriptions_on_player_id"
  end

  add_foreign_key "confirmation_codes", "players"
  add_foreign_key "games", "players"
  add_foreign_key "player_gaming_histories", "players"
  add_foreign_key "pp_customer_infos", "payment_providers"
  add_foreign_key "pp_customer_infos", "players"
  add_foreign_key "subscriptions", "payment_providers"
  add_foreign_key "subscriptions", "players"
end
