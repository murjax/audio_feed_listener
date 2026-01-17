import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "listView",
    "mapView",
    "presetView",
    "listViewButton",
    "mapViewButton",
    "presetViewButton",
    "savePresetButton",
    "map"
  ];

  selectedFeeds = [];
  browseView = "list";

  showListView() {
    this.browseView = "list";

    this.listViewButtonTarget.classList.remove(...["bg-gray-100", "text-gray-700"]);
    this.listViewButtonTarget.classList.add(...["bg-blue-500", "text-white"]);

    this.mapViewButtonTarget.classList.remove(...["bg-blue-500", "text-white"]);
    this.mapViewButtonTarget.classList.add(...["bg-gray-100", "text-gray-700"]);

    this.presetViewButtonTarget.classList.remove(...["bg-blue-500", "text-white"]);
    this.presetViewButtonTarget.classList.add(...["bg-gray-100", "text-gray-700"]);

    this.mapViewTarget.classList.add("hidden");
    this.presetViewTarget.classList.add("hidden");
    this.listViewTarget.classList.remove("hidden");
  }

  showMapView() {
    this.browseView = "map";

    this.mapViewButtonTarget.classList.remove(...["bg-gray-100", "text-gray-700"]);
    this.mapViewButtonTarget.classList.add(...["bg-blue-500", "text-white"]);

    this.listViewButtonTarget.classList.remove(...["bg-blue-500", "text-white"]);
    this.listViewButtonTarget.classList.add(...["bg-gray-100", "text-gray-700"]);

    this.presetViewButtonTarget.classList.remove(...["bg-blue-500", "text-white"]);
    this.presetViewButtonTarget.classList.add(...["bg-gray-100", "text-gray-700"]);

    this.listViewTarget.classList.add("hidden");
    this.presetViewTarget.classList.add("hidden");
    this.mapViewTarget.classList.remove("hidden");

    if (!this.mapTarget.querySelector(".leaflet-map-pane")) {
      const leafletMap = L.map(this.mapTarget.id).setView([39.8195318, -98.6316774], 4);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(leafletMap);

      document.querySelectorAll(".audio-feed-item").forEach((feedElement) => {
        const feed = this.getFeedFromElement(feedElement);
        const marker = L.marker([feed.latitude, feed.longitude]).addTo(leafletMap);

        marker.bindPopup(
          `
            <div id="feed-popup-${feed.id}">
              <div class="font-bold">${feed.name}</div>
              <button
                class="text-white bg-blue-400 rounded cursor-pointer font-bold p-2 mt-1 hover:bg-blue-500"
              >
                Add Feed
              </button>
            </div>
          `
        );

        marker.on("popupopen", () => {
          const addButton = document.getElementById(`feed-popup-${feed.id}`);
          addButton.addEventListener("click", () => this.addFeed(feed));
        });
      });
    }
  }

  showPresetView() {
    this.browseView = "preset";

    this.presetViewButtonTarget.classList.remove(...["bg-gray-100", "text-gray-700"]);
    this.presetViewButtonTarget.classList.add(...["bg-blue-500", "text-white"]);

    this.listViewButtonTarget.classList.remove(...["bg-blue-500", "text-white"]);
    this.listViewButtonTarget.classList.add(...["bg-gray-100", "text-gray-700"]);

    this.mapViewButtonTarget.classList.remove(...["bg-blue-500", "text-white"]);
    this.mapViewButtonTarget.classList.add(...["bg-gray-100", "text-gray-700"]);

    this.mapViewTarget.classList.add("hidden");
    this.listViewTarget.classList.add("hidden");
    this.presetViewTarget.classList.remove("hidden");
  }

  async savePreset() {
    const name = prompt("Enter a name for this preset");

    const audioFeedIds = this.selectedFeeds.map((feed) => feed.id);
    const payload = JSON.stringify({
      name,
      audio_feed_ids: audioFeedIds
    });

    try {
      const token = document.getElementsByName('csrf-token')[0].content;

      const response = await fetch("/presets.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token
        },
        body: payload
      });
      const jsonResponse = await response.json();
      this.addPresetElement(jsonResponse.preset, audioFeedIds);
    } catch (errors) {
      alert("preset failed to save");
    }
  }

  addPresetElement(preset, audioFeedIds) {
    const presetTemplate = document.querySelector("#preset-template");
    const presetElement = presetTemplate.cloneNode(true);
    presetElement.querySelector(".preset-name").innerHTML = preset.name;
    presetElement.classList.remove("hidden");
    presetElement.removeAttribute("id");

    const presetItemElement = presetElement.querySelector(".preset-item");
    presetItemElement.setAttribute("data-audio-feed-ids", audioFeedIds.join(","));
    presetItemElement.setAttribute("data-id", preset.id);

    presetElement.querySelector(".preset-feed-count").innerHTML = `${audioFeedIds.length} feeds`;

    this.presetViewTarget.appendChild(presetElement);
  }

  applyPreset(event) {
    const presetElement = event.currentTarget.closest(".preset-item");
    const audioFeedIds = presetElement.getAttribute("data-audio-feed-ids").split(",");
    document.querySelectorAll(".audio-feed-item").forEach((audioFeedItem) => {
      const id = audioFeedItem.getAttribute("data-id");

      if (!audioFeedIds.includes(id)) { return; }
      const feed = this.getFeedFromElement(audioFeedItem);
      this.addFeed(feed);
    });
  }

  async deletePreset(event) {
    const presetElement = event.currentTarget.closest(".preset-item");
    const id = presetElement.getAttribute("data-id");
    const token = document.getElementsByName('csrf-token')[0].content;

    try {
      const response = await fetch(`/presets/${id}.json`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token
        },
      });
      if (response.status === 204) {
        presetElement.remove();
      } else {
        alert("preset failed to delete");
      }
    } catch (errors) {
      alert("preset failed to delete");
    }
  }

  addFeed(feed) {
    if (this.selectedFeeds.some((selectedFeed) => selectedFeed.id == feed.id)) {
      return;
    }

    this.selectedFeeds.push(feed);
    this.showSavePresetButton();
    this.addFeedElement(feed);
  }

  addFeedFromEvent(event) {
    const feed = this.getFeedFromElement(event.currentTarget);
    this.addFeed(feed)
  }

  addFeedElement(feed) {
    const selectedFeedsElement = document.querySelector("#selected-feeds");
    const selectedFeedTemplate = document.querySelector("#selected-feed-template");
    const selectedFeedElement = selectedFeedTemplate.cloneNode(true);

    selectedFeedElement.classList.remove("hidden");
    selectedFeedElement.setAttribute("id", `feed-${feed.id}`);
    selectedFeedElement.querySelector(".selected-feed-name").innerHTML = feed.name;
    selectedFeedElement.querySelector(".selected-feed-location").innerHTML = feed.location;
    selectedFeedElement.querySelector(".selected-feed-remove").addEventListener(
      "click",
      () => this.removeFeed(feed.id)
    );
    selectedFeedElement.querySelector(".selected-feed-player").setAttribute(
      "src",
      `https://broadcastify.cdnstream1.com/${feed.remoteId}`
    );
    selectedFeedsElement.appendChild(selectedFeedElement);
  }

  removeFeed(feedId) {
    const feed = this.selectedFeeds.find((feed) => feed.id === feedId);
    const index = this.selectedFeeds.indexOf(feed);
    this.selectedFeeds.splice(index, 1);

    this.hideSavePresetButton();
    this.removeFeedElement(feedId);
  }

  removeFeedElement(feedId) {
    document.querySelector(`#feed-${feedId}`).remove();
  }

  getFeedFromElement(feedElement) {
    const id = feedElement.getAttribute("data-id");
    const name = feedElement.getAttribute("data-name");
    const location = `${feedElement.getAttribute("data-city")}, ${feedElement.getAttribute("data-state")}`;
    const latitude = feedElement.getAttribute("data-latitude");
    const longitude = feedElement.getAttribute("data-longitude");
    const remoteId = feedElement.getAttribute("data-remote-id");

    return {
      id,
      name,
      location,
      latitude,
      longitude,
      remoteId
    };
  }

  showSavePresetButton() {
    this.savePresetButtonTarget.classList.remove("hidden");
  }

  hideSavePresetButton() {
    if (!!this.selectedFeeds.length) { return; }

    this.savePresetButtonTarget.classList.add("hidden");
  }

  searchFeeds(event) {
    document.querySelectorAll(".audio-feed-item").forEach((audioFeedItem) => {
      const name = audioFeedItem.getAttribute("data-name");
      if (!name) { return; }

      if (name.toLowerCase().includes(event.currentTarget.value.toLowerCase())) { 
        audioFeedItem.classList.remove("hidden");
      } else {
        audioFeedItem.classList.add("hidden");
      }
    });
  }
}
