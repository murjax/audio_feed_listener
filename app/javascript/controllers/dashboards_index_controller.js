import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map"];

  async mapTargetConnected() {
    const leafletMap = L.map(this.mapTarget.id).setView([39.8195318, -98.6316774], 5);

    const feedResponse = await fetch("/audio_feeds.json");
    const audioFeedData = await feedResponse.json();
    const audioFeeds = audioFeedData.data;
    console.log(audioFeeds);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(leafletMap);

    if (audioFeeds.length) {
      audioFeeds.forEach((audioFeed) => {
        const marker = L.marker([audioFeed.latitude, audioFeed.longitude]).addTo(leafletMap);
        marker.bindPopup(audioFeed.name);
      });
    }
  }
}
