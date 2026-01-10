class AddCityAndStateToAudioFeeds < ActiveRecord::Migration[8.1]
  def change
    add_column :audio_feeds, :city, :string
    add_column :audio_feeds, :state, :string
  end
end
