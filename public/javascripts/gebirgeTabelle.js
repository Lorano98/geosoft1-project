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

geojson.forEach((item) => {
  let c = item.geometry.coordinates;
  let p = item.properties;

  // Prüfen, ob Link gültig ist
  if (isValidHttpUrl(p.url)) {
    // Prüfen, ob der Link ein wikipedialink ist
    if (p.url.indexOf("wikipedia") !== -1) {
      let urlArray = p.url.split("/");
      let title = urlArray[urlArray.length - 1];

      var x = new XMLHttpRequest();
      x.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let res = JSON.parse(this.responseText);
          console.log(res.query.pages);
          const pageKey = Object.keys(res.query.pages)[0];
          const content = res.query.pages[pageKey].extract;
          console.log(content);
        }
      };
      x.open(
        "GET",
        "http://de.wikipedia.org/w/api.php?format=json&exintro=1&action=query&prop=extracts&explaintext=1&origin=*&titles=" +
          title,
        false
      ); // false for synchronous request
      x.send();
    }
  }

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

const table = document.getElementById("tabelle");

geojson.forEach((item) => {
  let c = item.geometry.coordinates;
  let p = item.properties;

  let row = table.insertRow(-1);

  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(4);
  let cell6 = row.insertCell(5);

  cell1.innerHTML = p.name;
  cell2.innerHTML = p.hoehe;
  cell3.innerHTML = p.beschreibung;
  cell4.innerHTML = Math.round(c[0] * 100) / 100;
  cell5.innerHTML = Math.round(c[1] * 100) / 100;
  cell6.innerHTML = p.url;
});

console.log(table);
