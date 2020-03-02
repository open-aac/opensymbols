Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'index#root'
  get '/search' => 'index#search'
  get '/editor' => 'index#editor'
  get '/core' => 'index#core'
  get '/badge_maker' => 'index#badge_maker'
  get '/word_maker' => 'index#word_maker'
  get '/word_art' => 'index#word_art'
  get '/repositories/:repo_key' => 'index#repo'
  get '/symbols/:repo_key/:symbol_key' => 'index#symbol'

  get '/login' => 'admin#login'
  get '/admin' => 'admin#index'
  get '/stats' => 'index#stats'
  get '/auth/coughdrop/:id' => 'session#coughdrop_auth'
  get '/api/v1/token_check' => 'admin#token_check'

  scope 'api/v1', :module => 'api' do
    get "symbols/remote_search" => 'legacy#remote_search'
    get "repositories/:repo_key/symbols" => 'legacy#repo_symbols'
    get "symbols/search" => 'legacy#search'
    post "symbols/:id/use" => 'legacy#track_use'
    get "symbols/random" => 'legacy#random_symbols'
    get "symbols/data_proxy" => 'legacy#data_proxy'
#    options "symbols/proxy" => 'legacy#proxy'
    get "symbols/proxy" => 'legacy#proxy'
    get "symbols/requests" => 'legacy#requests'
    post "symbols/requests" => 'legacy#add_request'
  end

  scope 'api/v2', :module => 'api' do
    resources :repositories do
      post 'images'
      post 'defaults'
    end
    resources :symbols, :constraints => {:id => /[a-zA-Z0-9_-]+\/[a-zA-Z0-9_:%-]+/} do
      post 'safe'
      post 'boost'
      post 'default'
    end
    resources :requests
  end
end
