import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map"];

  mapTargetConnected() {
    const leafletMap = L.map(this.mapTarget.id).setView([39.8195318, -98.6316774], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(leafletMap);
  }
}
