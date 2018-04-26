Rails.application.routes.draw do
  get 'welcome/index'
  root 'welcome#index'

  post '/games', to: 'games#create'
  get '/games/:id', to: 'games#show', as: 'game'
  get '/checkemail', to: 'players#check_email'
  get '/checkcellphone', to: 'players#check_cellphone'
  get '/checkdisplayname', to: 'players#check_displayname'


  resources :players
  resources :paymentserviceproviders

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
