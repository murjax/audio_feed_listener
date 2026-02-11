# Audio Feed Listener

Audio Feed Listener is a web application for simultaneously playing multiple audio feeds. The database may contain a list of feeds from a remote source. Users can then pick and choose any number of feeds to start. The system was designed around Broadcastify, but any host with a common http host and unique feed IDs is supported.

### Features
- Select audio feeds to start in a player
- Quick search of feeds by name
- Presets for quickly returning to favorite feed selections
- Map view for quick selecting feeds from a favorite location

### Requirements
- Ruby 3.4.8 (or greater)
- Postgres 18 (or greater)
- Audio feed host serving feeds over HTTP

### Local Setup
1. Clone project: `git clone git@github.com:murjax/audio_feed_listener.git`
2. Navigate into folder: `cd audio_feed_listener`
3. Install gems: `bundle install`
4. Set environment variables (defined below)
5. Setup database: `bundle exec rails db:create; bundle exec rails db:migrate`
6. Optional - Generate seed data: `bundle exec rails db:seed`
7. Start the server: `rails s`
8. Navigate to `http://localhost:3000`
9. You can now start using Audio Feed Listener!

### Required Environment Variables
`DATABASE_URL` (prod only)
`DEV_DATABASE_URL`
`TEST_DATABASE_URL`
`DEV_AUDIO_HOST_URL`
`TEST_AUDIO_HOST_URL`
`AUDIO_HOST_URL` (prod only)

### Unit Tests
1. `bundle exec rails db:setup`
2. `bundle exec rspec spec`

### Cypress Tests
1. Start dev server: `CYPRESS=1 bin/rails server -p 5017`
2. Open cypress: `npx cypress open --project ./e2e`
