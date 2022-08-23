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

  var beschr;

  // Prüfen, ob Link ungültig ist
  if (!isValidHttpUrl(req.body.url)) {
    beschr = "Keine Informationen verfügbar";
    // Prüfen, ob der Link kein wikipedialink ist
  } else if (req.body.url.indexOf("wikipedia") === -1) {
    beschr = "Keine Informationen verfügbar";
  } else {
    let urlArray = req.body.url.split("/");
    let title = urlArray[urlArray.length - 1];

    axios
      .get(
        "https://de.wikipedia.org/w/api.php?format=json&exintro=1&action=query&prop=extracts&explaintext=1&exsentences=1&origin=*&titles=" +
          title
      )
      .then(function (response) {
        // Beschreibung aus der response rausfiltern
        const pageKey = Object.keys(response.data.query.pages)[0];
        beschr = response.data.query.pages[pageKey].extract;

        console.log("Beschreibung");

        //geojson
        let gebirge = {
          type: "Feature",
          properties: {
            shape: "Marker",
            name: req.body.name,
            hoehe: req.body.hoehe,
            url: req.body.url,
            beschreibung: beschr,
            category: "default",
          },
          geometry: {
            type: "gebirgent",
            coordinates: [req.body.y, req.body.x],
          },
        };

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
        });
      })
      .catch(function (error) {
        // Handle error
        console.log(error);
      });
  }
});

// Wird ausgeführt, wenn der Speichern Button gedrückt wurde
router.post("/finishGeoJSON", function (req, res, next) {
  console.log(req);
});

module.exports = router;

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
