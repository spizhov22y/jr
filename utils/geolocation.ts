// Geolocation data for cities within 100 km of Kelowna
const locations = [
  { name: "Kelowna", lat: 49.888, lon: -119.496 },
  { name: "West Kelowna", lat: 49.829, lon: -119.621 },
  { name: "Vernon", lat: 50.034, lon: -119.403 },
  { name: "Peachland", lat: 49.758, lon: -119.738 },
  { name: "Summerland", lat: 49.6, lon: -119.682 },
];

// Function to return a random location
export function getRandomLocation() {
  const randomIndex = Math.floor(Math.random() * locations.length);
  return locations[randomIndex];
}

// const locations = [
//   { name: "Kelowna", lat: 49.888, lon: -119.496 },
//   { name: "West Kelowna", lat: 49.829, lon: -119.621 },
//   { name: "Vernon", lat: 50.034, lon: -119.403 },
//   { name: "Peachland", lat: 49.758, lon: -119.738 },
//   { name: "Summerland", lat: 49.6, lon: -119.682 },
//   { name: "Penticton", lat: 49.499, lon: -119.593 },
//   { name: "Lake Country", lat: 50.029, lon: -119.404 },
//   { name: "Winfield", lat: 50.028, lon: -119.407 },
//   { name: "Naramata", lat: 49.598, lon: -119.593 },
//   { name: "Oyama", lat: 50.12, lon: -119.388 },
// ];
