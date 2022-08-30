var mark = null;
var coords = null;

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

mapboxgl.accessToken =
  "pk.eyJ1IjoiYndhZGFtc29uIiwiYSI6ImNqajZhNm1idDFzMjIza3A2Y3ZmdDV6YWYifQ.9NhptR7a9D0hzWXR51y_9w";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
  center: [54, 25],
  zoom: 4,
});

map.on("load", function () {
  var directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
  });
  map.addControl(directions, "top-left");

  directions.setOrigin("Schwabenstraße 15, Bocholt, Deutschland");
  directions.setDestination("Gasselstiege 48, Münster, Deutschland");
});

/*
L.mapbox.accessToken =
  "pk.eyJ1IjoiZmFyYWRheTIiLCJhIjoiTUVHbDl5OCJ9.buFaqIdaIM3iXr1BOYKpsQ";

var mapboxTiles = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=" +
    L.mapbox.accessToken,
  {
    attribution:
      '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1,
  }
);

var map = L.map("map").addLayer(mapboxTiles).setView([42.361, -71.0587], 15);
L.routing
  .control({
    router: L.routing.mapbox(L.mapbox.accessToken, {
      profile: "mapbox/walking",
      language: "en",
    }),
    waypoints: [
      L.latLng(40.779625, -73.969111),
      L.latLng(40.767949, -73.971855),
    ],
  })
  .addTo(map);
  */
/*
//Mapbox
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v9",
});

map.addControl(directions, "top-left");
*/
// Karte mit Zentrum definieren
// var map = L.map("map").setView([54, 25], 4);
// //OSM Layer
// var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(map);

// var OpenTopoMap = L.tileLayer(
//   "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
//   {
//     maxZoom: 17,
//     attribution:
//       'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
//   }
// );

// //Array für GebirgeMarker
// var mountains = [];

// geojson.forEach((item) => {
//   let c = item.geometry.coordinates;
//   let p = item.properties;

//   //Punkte zur Karte hinzufügen
//   let popupText =
//     "<table  class='table table-striped table-dark table-hover'>" +
//     "  <tr>" +
//     "    <th>Name</th>" +
//     "    <td>" +
//     p.name +
//     "</td>" +
//     "  </tr>" +
//     "  <tr>" +
//     "    <th>Höhe</th>" +
//     "    <td>" +
//     p.hoehe +
//     "</td>" +
//     "  </tr>" +
//     "  <tr>" +
//     "    <th>Url</th>" +
//     "    <td>" +
//     p.url +
//     "</td>" +
//     "  </tr>" +
//     "  <tr>" +
//     "    <th>Beschreibung</th>" +
//     "    <td>" +
//     p.beschreibung +
//     "</td>" +
//     "  </tr>" +
//     "</table>";

//   let marker = L.marker([c[1], c[0]], { icon: mountainIcon });
//   marker.bindPopup(popupText);

//   mountains.push(marker);
// });

// //Layer mit gebirgen
// var mountainsLayer = L.layerGroup(mountains);

// //Basemaps immer nur eine aktiv
// var baseMaps = {
//   OpenStreetMap: osm,
//   Topographische_Karte: OpenTopoMap,
// };
// //OverlayMaps nach belieben aktivieren
// var overlayMaps = {
//   Gebirge: mountainsLayer,
// };
// //Layer Controlbar
// var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

function getLocation() {
  var standort = [];
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      standort.push(position.coords.latitude, position.coords.longitude);
      var marker = new L.marker(standort, { icon: standortIcon }).addTo(map);
    });
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
