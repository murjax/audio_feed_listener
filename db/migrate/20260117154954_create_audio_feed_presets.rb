class CreateAudioFeedPresets < ActiveRecord::Migration[8.1]
  def change
    create_table :audio_feed_presets do |t|
      t.references :audio_feed, index: true, foreign_key: true, null: false
      t.references :preset, index: true, foreign_key: true, null: false
      t.timestamps
    end
  end
end
