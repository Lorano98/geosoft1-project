var mark = null;
var coords = null;
var nameInput = document.getElementById("name");
var hoeheInput = document.getElementById("hoehe");
var urlInput = document.getElementById("url");
var xInput = document.getElementById("x");
var yInput = document.getElementById("y");
var textareaGeoJSON = document.getElementById("anlegenTextarea");
var fileInput = document.getElementById("geojsonFile");

// Events, wenn einer der Felder verändert wird.
xInput.addEventListener("change", checkInputs);
yInput.addEventListener("change", checkInputs);
textareaGeoJSON.addEventListener("change", checkTextArea);
fileInput.addEventListener("change", fileChange);

var mountainIcon = L.icon({
  iconUrl: "images/mountain-svgrepo-com.svg",
  iconSize: [35, 46], // // Größe des Icon
  iconAnchor: [17, 46], // punkt vom icon, relativ von dem Markerpunkt
  popupAnchor: [-3, -76], // punkt von dem das PopUp relativ zum iconAnchor öffnet
});

// Karte mit Zentrum definieren
var map = L.map("map").setView([54, 25], 4);

// OSM Layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

/**
 * Festlegen der Marker- und Popup-Struktur für jedes Element
 * in der Geo-JSON Datei, sowie das Hinzufügen zur Karte und von dem PopUp
 */
geojson.forEach((item) => {
  let c = item.geometry.coordinates;
  let p = item.properties;

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

  L.marker([c[1], c[0]], { icon: mountainIcon })
    .addTo(map)
    .bindPopup(popupText);
});

// Toolbar zum Zeichnen
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    edit: false,
    delete: false,
    remove: false,
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

/**
 * Überprüft, ob alle Inputfelder der Koordinaten gefüllt sind und
 * aktiviert/deaktiviert den Speichernknopf.
 */
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

/**
 * Überprüft, dass das eingeladene geojson die richtige Struktur hat
 */
function checkTextArea() {
  if (!isJsonString(textareaGeoJSON.value)) {
    document.getElementById("anlegenGeoJSONSpeichern").disabled = true;
  } else {
    document.getElementById("anlegenGeoJSONSpeichern").disabled = false;
  }
}

/**
 * Überprüft einen Text, ob er die Struktur eines GeoJSON hat.
 * Quelle: https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string
 * @param {*} str
 * @returns
 */
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * Wird ausgeführt, wenn eine Datei hochgeladen wurde.
 * Quelle: https://stackoverflow.com/questions/23344776/how-to-access-data-of-uploaded-json-file
 * @param {*} event
 */
function fileChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

/**
 * Wird ausgeführt, wenn eine Datei hochgeladen wurde.
 * @param {*} event
 */
function onReaderLoad(event) {
  textareaGeoJSON.value = event.target.result;
  checkTextArea();
}
