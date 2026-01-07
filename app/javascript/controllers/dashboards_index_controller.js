import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map"];

  selectedFeeds = [];

  async mapTargetConnected() {
    const leafletMap = L.map(this.mapTarget.id).setView([39.8195318, -98.6316774], 5);

    const feedResponse = await fetch("/audio_feeds.json");
    const audioFeedData = await feedResponse.json();
    const audioFeeds = audioFeedData.data;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(leafletMap);

    if (audioFeeds.length) {
      audioFeeds.forEach((audioFeed) => {
        const marker = L.marker([audioFeed.latitude, audioFeed.longitude]).addTo(leafletMap);
        marker.bindPopup(
          `
            <div id="feed-popup-${audioFeed.id}">
              <div class="font-bold">${audioFeed.name}</div>
              <button
                class="text-white bg-blue-400 rounded cursor-pointer font-bold p-2 mt-1 hover:bg-blue-500"
              >
                Add Feed
              </button>
            </div>
          `
        );

        marker.on("popupopen", () => {
          const addButton = document.getElementById(`feed-popup-${audioFeed.id}`);
          addButton.addEventListener("click", () => this.addFeed(audioFeed));
        });
      });
    }
  }

  addFeed(audioFeed) {
    if (!!document.querySelector(`[data-feed-id="${audioFeed.id}"]`)) { return; }
    this.selectedFeeds.push(audioFeed);
    this.updatePlayUrl();
    this.addFeedElement(audioFeed);
  }

  addFeedElement(audioFeed) {
    const selectedFeedsElement = document.querySelector("#selected-feeds");
    const selectedFeedTemplate = document.querySelector("#selected-feed-template");
    const selectedFeedElement = selectedFeedTemplate.cloneNode(true);
    selectedFeedElement.classList.remove("hidden");
    selectedFeedElement.querySelector("span").innerHTML = audioFeed.name;
    selectedFeedElement.removeAttribute("id");
    selectedFeedElement.setAttribute("data-feed-id", audioFeed.id);
    selectedFeedElement.querySelector("svg").addEventListener("click", () => this.removeFeed(audioFeed.id));
    selectedFeedsElement.appendChild(selectedFeedElement);
  }

  removeFeed(audioFeedId) {
    const audioFeed = this.selectedFeeds.find((audioFeed) => audioFeed.id === audioFeedId);
    const index = this.selectedFeeds.indexOf(audioFeed);
    this.selectedFeeds.splice(index, 1);
    this.updatePlayUrl();
    this.removeFeedElement(audioFeedId);
  }

  removeFeedElement(audioFeedId) {
    document.querySelector(`[data-feed-id="${audioFeedId}"]`).remove();
  }

  updatePlayUrl() {
    const audioFeedIds = this.selectedFeeds.map((audioFeed) => audioFeed.id);
    const href = `/feed_listeners?audio_feed_ids=${audioFeedIds.join(",")}`;
    const feedListenerLink = document.querySelector("#feed-listener-link");
    feedListenerLink.setAttribute("href", href);
  }
}
