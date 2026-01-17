class AudioFeedPreset < ApplicationRecord
  belongs_to :audio_feed
  belongs_to :preset
end
