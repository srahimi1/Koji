Rails.application.routes.draw do
  get 'welcome/index'
  root 'welcome#index'

  resources :players
  resources :paymentserviceproviders
  resources :games, :only => [:create, :update]
  resources :messages, only: [:create]

  get '/index2', to: 'welcome#index2'
  get '/index3', to: 'welcome#index3'
  get '/index4', to: 'welcome#index4'
  get '/index5', to: 'welcome#index5'
  get '/index6', to: 'welcome#index6'
  get '/all', to: 'welcome#all'



  get '/checkemail', to: 'players#check_email'
  get '/checkcellphone', to: 'players#check_cellphone'
  get '/checkdisplayname', to: 'players#check_displayname'
  get '/message', to: 'players#startup_message'
  post '/players/login', to: 'players#login'
  get '/googleplaysubscriptions/subscribeWithGooglePlay', to: 'google_play_subscriptions#subscribe_with_google_play'
  get '/googleplaysubscriptions/getAccessAndRefreshTokens', to: 'google_play_subscriptions#get_access_and_refresh_tokens'
  get '/googleplaysubscriptions/getAccessTokenFromRefreshToken', to: 'google_play_subscriptions#get_access_token_from_refresh_token'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
