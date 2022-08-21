var mark = null;
var coords = null;
var nameInput = document.getElementById("name");
var hoeheInput = document.getElementById("hoehe");
var urlInput = document.getElementById("url");
var xInput = document.getElementById("x");
var yInput = document.getElementById("y");

// Karte mit Zentrum definieren
var map = L.map("map").setView([51.96, 7.62], 13);

// OSM Layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//Fügt alle Punkte auf der Karte ein
geojson.forEach((item) => {
  let c = item.geometry.coordinates;
  let p = item.properties;

  let popupText = p.name;
  L.marker([c[1], c[0]]).addTo(map).bindPopup(popupText);
});

// Toolbar zum Zeichnen von Rechtecken
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
  },
  draw: {
    polygon: false,
    rectangle: false,
    marker: true,
    circle: false,
    polyline: false,
  },
});
map.addControl(drawControl);

// Event Listener, der aktiv wird, wenn fertig gezeichnet wurde
map.on(L.Draw.Event.CREATED, function (e) {
  mark = e.layer;
  map.addLayer(mark);

  coords = e.layer.getLatLng();
  xInput.value = coords.lat;
  yInput.value = coords.lng;
  console.log(coords);
});

// Löschen des letzten Punkts
map.on(L.Draw.Event.DRAWSTART, function (e) {
  if (mark != null) {
    map.removeLayer(mark);
    coords = null;
    xInput.value = "";
    yInput.value = "";
  }
});
