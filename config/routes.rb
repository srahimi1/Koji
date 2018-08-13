Rails.application.routes.draw do
  get 'welcome/index'
  root 'welcome#index'

  resources :players
  resources :paymentserviceproviders
  resources :games, :only => [:create, :update]
  resources :messages, only: [:create]

  get '/checkemail', to: 'players#check_email'
  get '/checkcellphone', to: 'players#check_cellphone'
  get '/checkdisplayname', to: 'players#check_displayname'
  get '/message', to: 'players#startup_message'
  post '/players/login', to: 'players#login'
  get '/googleplaysubscriptions/subscribeWithGooglePlay', to: 'google_play_subscriptions#subscribe_with_google_play'
  get '/googleplaysubscriptions/getAccessAndRefreshTokens', to: 'google_play_subscriptions#get_access_and_refresh_tokens'
  post '/googleplaysubscriptions/getAccessAndRefreshTokens', to: 'google_play_subscriptions#get_access_and_refresh_tokens'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
