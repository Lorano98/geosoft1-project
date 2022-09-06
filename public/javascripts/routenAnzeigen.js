//import myImage from "/images/mountain-svgrepo-com.svg";

var mark = null;
var coords = null;
var directions;

let standortKnopf = document.getElementById("meinStandort");
standortKnopf.addEventListener("click", getLocation);

var mountainIcon = L.icon({
  iconUrl: "images/mountain-svgrepo-com.svg",
  //shadowUrl: "leaf-shadow.png",
  iconSize: [38, 95], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

var standortIcon = L.icon({
  iconUrl: "images/Standort_Icon.png",
  //shadowUrl: "leaf-shadow.png",
  iconSize: [25, 34], // size of the icon
  //shadowSize: [50, 64], // size of the shadow
  iconAnchor: [17, 46], // point of the icon which will correspond to marker's location
  //shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

// Mapbox
mapboxgl.accessToken =
  "pk.eyJ1IjoiYndhZGFtc29uIiwiYSI6ImNqajZhNm1idDFzMjIza3A2Y3ZmdDV6YWYifQ.9NhptR7a9D0hzWXR51y_9w";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  center: [25, 54],
  zoom: 2,
});

map.on("load", function () {
  directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
  });
  map.addControl(directions, "top-left");

  //directions.setOrigin("Schwabenstraße 15, Bocholt, Deutschland");
  //directions.setDestination("Gasselstiege 48, Münster, Deutschland");

  // Quelle:
  // https://docs.mapbox.com/mapbox-gl-js/example/custom-marker-icons/
  // Add markers to the map.
  for (const marker of geojson) {
    // Create a DOM element for each marker.
    let el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = "url(images/mountain-svgrepo-com.svg)";
    el.style.width = "25px";
    el.style.height = "25px";
    el.style.backgroundSize = "100%";

    el.addEventListener("click", () => {
      setTimeout(function () {
        directions.setDestination(marker.geometry.coordinates);
      }, 500);
    });

    // Add markers to the map.
    new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
  }
});

/**
 * Ermittelt den Standort und setzt ihn als Start im Routing.++++++++++++++++++++++++++++
 */
function getLocation() {
  var standort = [];
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      standort.push(position.coords.latitude, position.coords.longitude);
      directions.setOrigin([standort[1], standort[0]]);

      // Symbol
      let el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(images/Standort_Icon.png)";
      el.style.width = "25px";
      el.style.height = "25px";
      el.style.backgroundSize = "100%";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([standort[1], standort[0]])
        .addTo(map);
      //var marker = new L.marker(standort, { icon: standortIcon }).addTo(map);
    });
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
