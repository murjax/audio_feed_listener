class CreateAudioFeeds < ActiveRecord::Migration[8.1]
  def change
    create_table :audio_feeds do |t|
      t.string :name, null: false
      t.string :remote_id, null: false
      t.string :latitude, null: false
      t.string :longitude, null: false
      t.timestamps
    end
  end
end
