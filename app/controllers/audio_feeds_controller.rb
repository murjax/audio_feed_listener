class AudioFeedsController < ApplicationController
  def index
    json_data = AudioFeed.all.map(&:attributes)
    respond_to do |format|
      format.json { render json: {data: json_data} }
    end
  end
end
