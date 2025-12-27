class FeedListenersController < ApplicationController
  def index
    @audio_feeds = AudioFeed.where(id: permitted_params[:audio_feed_ids].split(","))
  end

  private

  def permitted_params
    params.permit(:audio_feed_ids)
  end
end
