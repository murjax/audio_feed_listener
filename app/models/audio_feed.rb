class AudioFeed < ApplicationRecord
  validates :name, presence: true
  validates :remote_id, presence: true
  validates :latitude, presence: true
  validates :longitude, presence: true
end
