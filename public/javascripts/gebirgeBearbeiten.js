var mark = null;
var markerObjekt = {};
var coords = null;
var nameInput = document.getElementById("name");
var hoeheInput = document.getElementById("hoehe");
var urlInput = document.getElementById("url");
var xInput = document.getElementById("x");
var yInput = document.getElementById("y");

xInput.addEventListener("change", checkInputs);
yInput.addEventListener("change", checkInputs);

var mountainIcon = L.icon({
  iconUrl: "images/mountain-svgrepo-com.svg",
  //shadowUrl: "leaf-shadow.png",
  iconSize: [38, 95], // size of the icon
  //shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  //shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

// Karte mit Zentrum definieren
var map = L.map("map").setView([54, 25], 4);

// OSM Layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

//Fügt alle Punkte auf der Karte ein
geojson.forEach((item) => {
  let c = item.geometry.coordinates;
  let p = item.properties;
  /*
  let popupText =
    "<table  class='table table-striped table-dark table-hover'>" +
    "  <tr>" +
    "    <th>Name</th>" +
    "    <td>" +
    p.name +
    "</td>" +
    "  </tr>" +
    "  <tr>" +
    "    <th>Höhe</th>" +
    "    <td>" +
    p.hoehe +
    "</td>" +
    "  </tr>" +
    "  <tr>" +
    "    <th>Url</th>" +
    "    <td>" +
    p.url +
    "</td>" +
    "  </tr>" +
    "  <tr>" +
    "    <th>Beschreibung</th>" +
    "    <td>" +
    p.beschreibung +
    "</td>" +
    "  </tr>" +
    "</table>";
*/
  // Alle Marker werden unter ihrer Id gespeichert
  markerObjekt[item._id] = L.marker([c[1], c[0]], { icon: mountainIcon })
    .addTo(map)
    .on("click", markerClick);

  markerObjekt[item._id]._icon.id = item._id;
  //.bindPopup(popupText)

  /*function (event) {
      console.log(event.target);
      xInput.value = this.getLatLng().lat;
      yInput.value = this.getLatLng().lng;
    });*/
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
  checkInputs();
});

// Löschen des letzten Punkts
map.on(L.Draw.Event.DRAWSTART, function (e) {
  if (mark != null) {
    map.removeLayer(mark);
    coords = null;
    xInput.value = "";
    yInput.value = "";
    checkInputs();
  }
});

function checkInputs() {
  if (
    yInput.value == null ||
    yInput.value == "" ||
    xInput.value == null ||
    xInput.value == ""
  ) {
    document.getElementById("anlegenSpeichern").disabled = true;
  } else {
    document.getElementById("anlegenSpeichern").disabled = false;
  }
}

function markerClick(e) {
  console.log(markerObjekt[e.target._icon.id]);
  console.log(geojson);
  let g = geojson.find((element) => (element._id = e.target._icon.id));
  nameInput.value = g.properties.name;
  hoeheInput.value = g.properties.hoehe;
  urlInput.value = g.properties.url;
  xInput.value = g.geometry.coordinates[1];
  yInput.value = g.geometry.coordinates[0];
}
