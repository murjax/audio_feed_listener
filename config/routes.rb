Rails.application.routes.draw do
  resources :dashboards, only: :index
  resources :presets, only: %i[create destroy]

  root "dashboards#index"
end
