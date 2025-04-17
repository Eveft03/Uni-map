// Initialize the map
const map = L.map("map").setView([0, 0], 2); // Default center and zoom - will be adjusted later

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  detectRetina: true,
  retinaSuffix: "@2x",
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Initialize the marker layer
const marker = L.marker([51.5, -0.09]).addTo(map);

const pointsOfInterest = [
    { id: 1, lat: 0.01, lng: 0.01, title: "Point 1", description: "This is the first point of interest." },
    { id: 2, lat: 0.02, lng: 0.02, title: "Point 2", description: "This is the second point of interest." },
    { id: 3, lat: 0.015, lng: 0.03, title: "Point 3", description: "This is the third point of interest." }
];


   // Create a function to add numbered markers
   function createNumberedMarker(number) {
    return L.divIcon({
        className: 'marker-number',
        html: number,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}