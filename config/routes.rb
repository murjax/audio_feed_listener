Rails.application.routes.draw do
  resources :dashboards, only: :index
  root "dashboards#index"
end
