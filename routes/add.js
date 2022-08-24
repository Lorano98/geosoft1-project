var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017"; // connection URL
const client = new MongoClient(url); // mongodb client
const dbName = "mydb"; // database name
const collectionName = "gebirge"; // collection nam

const axios = require("axios").default;

/* GET users listing. */
router.get("/", function (req, res, next) {
  // connect to the mongodb database and retrieve all docs
  client.connect(function (err) {
    assert.equal(null, err);

    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    //Finden aller Punkte
    collection.find({}).toArray(function (err, docs) {
      assert.equal(err, null);
      //console.log("Found the following records...");
      //console.log(docs);
      //Übergeben der geojson an die pug Datei
      res.render("add", { title: "Gebirge Anlegen", data: docs });
    });
  });
});

// Wird ausgeführt, wenn der Speichern Button gedrückt wurde
router.post("/finish", function (req, res, next) {
  console.log("Punkt hinzugefügt");
  /*
  var beschr;

  // Prüfen, ob Link ungültig ist
  if (!isValidHttpUrl(req.body.url)) {
    beschr = "Keine Informationen verfügbar";
    console.log(beschr);
    // Prüfen, ob der Link kein wikipedialink ist
  } else if (req.body.url.indexOf("wikipedia") === -1) {
    beschr = "Keine Informationen verfügbar";
    console.log(beschr);
  } else {
    let urlArray = req.body.url.split("/");
    let title = urlArray[urlArray.length - 1];
    console.log(title);
    (async () => {
      await axios
        .get(
          "https://de.wikipedia.org/w/api.php?format=json&exintro=1&action=query&prop=extracts&explaintext=1&exsentences=1&origin=*&titles=" +
            title
        )
        .then(function (response) {
          // Beschreibung aus der response rausfiltern
          const pageKey = Object.keys(response.data.query.pages)[0];
          beschr = response.data.query.pages[pageKey].extract;
        });
    })();
  }
*/
  //geojson
  data = [
    {
      type: "Feature",
      properties: {
        shape: "Marker",
        name: req.body.name,
        hoehe: req.body.hoehe,
        url: req.body.url,
        beschreibung: "",
        category: "default",
      },
      geometry: {
        type: "gebirge",
        coordinates: [req.body.y, req.body.x],
      },
    },
  ];

  (async () => {
    await getBeschreibung();
  })();
  addPoint(res);
  /*
  // connect to the mongodb database and afterwards, insert one the new element
  client.connect(function (err) {
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert the document in the database
    collection.insertOne(gebirge, function (err, result) {
      console.log(
        `Inserted ${result.insertedCount} document into the collection`
      );
      res.render("add_notification", {
        title: "Vorgang abgeschlossen",
        data: gebirge,
      });
    });
  });*/
});

// Wird ausgeführt, wenn der Speichern Button gedrückt wurde
router.post("/finishGeoJSON", function (req, res, next) {
  data = JSON.parse(req.body.geojson[0]).features;
  (async () => {
    await getBeschreibung();
  })();
  addPoint(res);
});

module.exports = router;

async function getBeschreibung() {
  //for (let i = 0; i < data.length; i++) {
  data.forEach((element) => {
    var prop = element.properties;

    // Prüfen, ob Link ungültig ist
    if (!isValidHttpUrl(prop.url)) {
      prop.beschreibung = "Keine Informationen verfügbar";
      // Prüfen, ob der Link kein wikipedialink ist
    } else if (prop.url.indexOf("wikipedia") === -1) {
      prop.beschreibung = "Keine Informationen verfügbar";
    } else {
      let urlArray = prop.url.split("/");
      let title = urlArray[urlArray.length - 1];

      axios
        .get(
          "https://de.wikipedia.org/w/api.php?format=json&exintro=1&action=query&prop=extracts&explaintext=1&exsentences=1&origin=*&titles=" +
            title
        )
        .then(function (response) {
          // Beschreibung aus der response rausfiltern
          const pageKey = Object.keys(response.data.query.pages)[0];
          prop.beschreibung = response.data.query.pages[pageKey].extract;
          console.log("---------------beschr----------------");
          console.log(prop.beschreibung);
        });
    }
  });
}

function addPoint(res) {
  // connect to the mongodb database and afterwards, insert one the new element
  client.connect(function (err) {
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log("----------data-------------");
    console.log(data);
    // Insert the document in the database
    collection.insertMany(data, function (err, result) {
      console.log(
        `Inserted ${result.insertedCount} document into the collection`
      );
      res.render("add_notification", {
        title: "Vorgang abgeschlossen",
        data: data,
      });
    });
  });
}

// von Stackoverflow
// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
