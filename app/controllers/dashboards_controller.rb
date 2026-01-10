class DashboardsController < ApplicationController
  def index
    @audio_feeds = AudioFeed.all
  end
end
