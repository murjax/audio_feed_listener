import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "listView",
    "mapView",
    "presetView",
    "listViewButton",
    "mapViewButton",
    "presetViewButton",
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

    this.mapViewTarget.classList.add("hidden");
    this.listViewTarget.classList.remove("hidden");
  }

  showMapView() {
    this.browseView = "map";

    this.mapViewButtonTarget.classList.remove(...["bg-gray-100", "text-gray-700"]);
    this.mapViewButtonTarget.classList.add(...["bg-blue-500", "text-white"]);

    this.listViewButtonTarget.classList.remove(...["bg-blue-500", "text-white"]);
    this.listViewButtonTarget.classList.add(...["bg-gray-100", "text-gray-700"]);

    this.listViewTarget.classList.add("hidden");
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

  addFeed(feed) {
    if (this.selectedFeeds.some((selectedFeed) => selectedFeed.id == feed.id)) {
      return;
    }

    this.selectedFeeds.push(feed);
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
}
