FactoryBot.define do
  factory :audio_feed do
    city { Faker::Address.city }
    name { Faker::Name.name }
    latitude { Faker::Address.latitude }
    longitude { Faker::Address.longitude }
    state { Faker::Address.state_abbr }
    remote_id { Faker::Number.between(from: 1000, to: 2000) }
  end
end
