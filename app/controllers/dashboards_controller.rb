class DashboardsController < ApplicationController
  def index
    @audio_feeds = AudioFeed.all
    @presets = Preset.includes(:audio_feeds).all
  end
end
