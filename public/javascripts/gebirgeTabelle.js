var mark = null;
var coords = null;

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

const markerArray = [];

geojson.forEach((item) => {
  let c = item.geometry.coordinates;
  let p = item.properties;

  //Punkte zur Karte hinzufügen
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

  let marker = L.marker([c[1], c[0]], { icon: mountainIcon });
  marker.addTo(map).bindPopup(popupText);
  markerArray.push(marker);
});

//Punkte und Attribute zur Tabelle hinzufügen
const table = document.getElementById("tabelle");

geojson.forEach((item, i = 0) => {
  let c = item.geometry.coordinates;
  let p = item.properties;
  i++;

  let row = table.insertRow(-1);
  let cell0 = row.insertCell(0);
  let cell1 = row.insertCell(1);
  let cell2 = row.insertCell(2);
  let cell3 = row.insertCell(3);
  let cell4 = row.insertCell(4);
  let cell5 = row.insertCell(5);
  let cell6 = row.insertCell(6);

  cell0.innerHTML = i;
  cell1.innerHTML = p.name;
  cell2.innerHTML = p.hoehe;
  cell3.innerHTML = p.beschreibung;
  cell4.innerHTML = Math.round(c[0] * 100) / 100;
  cell5.innerHTML = Math.round(c[1] * 100) / 100;
  cell6.innerHTML = p.url;
});

console.log(table);

//Klick-Event-wenn auf Zeile in Tabelle auf Gebirge in Karte zoomen
//Quelle stackoverflow https://stackoverflow.com/questions/1207939/adding-an-onclick-event-to-a-table-row

function addRowHandlers() {
  var table = document.getElementById("tabelle");
  var rows = table.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
    var currentRow = table.rows[i];
    var createClickHandler = function (row) {
      return function () {
        var cell = row.getElementsByTagName("td")[0];
        var id = cell.innerHTML;
        //console.log(geojson[1]);
        var y = geojson[id - 1].geometry.coordinates[0];
        var x = geojson[id - 1].geometry.coordinates[1];
        //alert("id:" + id);
        map.setView([x, y], 10);
        markerArray[id - 1].openPopup();
      };
    };

    currentRow.onclick = createClickHandler(currentRow);
  }
}
window.onload = addRowHandlers();
