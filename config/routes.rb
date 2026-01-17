Rails.application.routes.draw do
  resources :audio_feeds, only: :index
  resources :dashboards, only: :index
  resources :feed_listeners, only: :index
  resources :presets, only: %i[create destroy]

  root "dashboards#index"
end
