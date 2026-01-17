class Preset < ApplicationRecord
  validates :name, presence: true
  has_many :audio_feed_presets, dependent: :destroy
  has_many :audio_feeds, through: :audio_feed_presets
end
