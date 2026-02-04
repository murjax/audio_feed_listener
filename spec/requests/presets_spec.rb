require "rails_helper"

RSpec.describe "/presets" do
  describe "#create" do
    subject do
      post presets_path(format: :json), params: params, headers: headers
      response
    end

    context "valid" do
      let(:audio_feed1) { create(:audio_feed) }
      let(:audio_feed2) { create(:audio_feed) }
      let(:audio_feed_ids) { [audio_feed1.id, audio_feed2.id] }
      let(:params) { {name: "Airports", audio_feed_ids: audio_feed_ids} }
      let(:json_response) { JSON.parse(response.body) }
      let(:preset) { Preset.find_by(id: json_response["preset"]["id"]) }

      it "creates a preset" do
        expect(subject).to have_http_status(:created)
        expect(preset.name).to eq(params[:name])
        expect(preset.audio_feeds.pluck(:id)).to match_array(audio_feed_ids)
      end
    end

    context "valid - missing audio feed ids" do
      let(:params) { {name: "Airports"} }
      let(:json_response) { JSON.parse(response.body) }
      let(:preset) { Preset.find_by(id: json_response["preset"]["id"]) }

      it "creates a preset" do
        expect(subject).to have_http_status(:created)
        expect(preset.name).to eq(params[:name])
        expect(preset.audio_feeds).to be_empty
      end
    end

    context "invalid - missing name" do
      let(:params) { {} }
      let(:json_response) { JSON.parse(response.body) }

      it "returns errors" do
        expect(subject).to have_http_status(:unprocessable_entity)
        expect(json_response["errors"]).to eq("Name can't be blank")
      end
    end
  end

  describe "#destroy" do
    context "preset exists" do
      let(:preset) { create(:preset) }

      subject do
        delete preset_path(preset, format: :json)
        response
      end

      it { is_expected.to have_http_status(:no_content) }
    end

    context "preset does not exist" do
      subject do
        delete preset_path(999, format: :json)
        response
      end

      it { is_expected.to have_http_status(:not_found) }
    end
  end
end
