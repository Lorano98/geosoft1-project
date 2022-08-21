var mark = null;
var coords = null;
var nameInput = document.getElementById("name");
var hoeheInput = document.getElementById("hoehe");
var urlInput = document.getElementById("url");
var xInput = document.getElementById("x");
var yInput = document.getElementById("y");

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

//Fügt alle Punkte in die Tabelle ein

var tabelle;

tabelle =
  "<table  class='table table-striped table-dark table-hover'>" +
  "<tr>" +
  "<td>" +
  "    <th>Name</th>" +
  "    </td>" +
  "<td>" +
  "    <th>Hoehe</th>" +
  "    </td>" +
  "<td>" +
  "    <th>Url</th>" +
  "    </td>" +
  "<td>" +
  "    <th>Beschreibung</th>" +
  "</td>" +
  "<td>" +
  "    <th>x-Koordinate</th>" +
  "</td>" +
  "</tr>";

geojson.forEach((item) => {
  let c = item.geometry.coordinates;
  let p = item.properties;

  tabelle +=
    "  <tr>" +
    "    <td>" +
    p.name +
    "</td>" +
    "    <td>" +
    p.hoehe +
    "    </td>" +
    "<td>" +
    p.url +
    "</td>" +
    "    <td>" +
    p.beschreibung +
    "</td>" +
    "  </tr>" +
    L.marker([c[1], c[0]], { icon: mountainIcon })
      .addTo(map)
      .bindPopup(popupText);
});

var featureNames = [];

for (var i = 0; i < geoJSON.features.length; i++) {
  var currentFeature = geoJSON.features[i];

  var featureName = currentFeature.properties.Name;
  var featureId = currentFeature.properties.FID;

  console.log(featureName);
  featureNames.push({
    Id: featureId,
    name: featureName,
    hoehe: featurehoehe,
    url: featureurl,
    beschreibung: featurebeschreibung,
  });
}
