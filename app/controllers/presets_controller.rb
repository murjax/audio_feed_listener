class PresetsController < ApplicationController
  def create
    respond_to do |format|
      format.json do
        Preset.transaction do
          preset = Preset.create!(name: permitted_params[:name])
          permitted_params[:audio_feed_ids].each do |audio_feed_id|
            AudioFeedPreset.create!(preset_id: preset.id, audio_feed_id: audio_feed_id)
          end

          render json: {preset: {id: preset.id, name: preset.name}}
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        if preset.destroy
          head :no_content
        else
          render json: {errors: preset.errors.full_messages.join(", ")}, status: :unprocessable_entity
        end
      end
    end
  end

  private

  def permitted_params
    params.permit(:id, :name, audio_feed_ids: [])
  end

  def preset
    @preset ||= Preset.find(permitted_params[:id])
  end
end
