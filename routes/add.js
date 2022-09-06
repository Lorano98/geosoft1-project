var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017"; // connection URL
const client = new MongoClient(url); // mongodb client
const dbName = "mydb"; // database name
const collectionName = "gebirge"; // collection nam

const axios = require("axios").default; //für Wikipedia

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
      //Übergeben der geojson an die pug Datei
      res.render("add", { title: "Gebirge Anlegen", data: docs });
    });
  });
});

// Wird ausgeführt, wenn der Speichern Button gedrückt wurde
router.post("/finish", function (req, res, next) {
  console.log("Punkt hinzugefügt");

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
  // Await hat nicht funktioniert, deswegen der timeout.
  setTimeout(function () {
    addPoint(res);
  }, 1500);
});

// Wird ausgeführt, wenn der Speichern Button gedrückt wurde
router.post("/finishGeoJSON", function (req, res, next) {
  data = JSON.parse(req.body.geojson[0]).features;
  (async () => {
    await getBeschreibung();
  })();
  // Await hat nicht funktioniert, deswegen der timeout.
  setTimeout(function () {
    addPoint(res);
  }, 1500);
});

module.exports = router;

/**
 * Ermittelt die Beschreibung des Gebirges.
 */
async function getBeschreibung() {
  await data.forEach((element) => {
    (async () => {
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

        let response = await axiosAbfrage(title);
        // Beschreibung aus der response rausfiltern
        const pageKey = Object.keys(response.data.query.pages)[0];
        prop.beschreibung = response.data.query.pages[pageKey].extract;
      }
    })();
  });
}

/**
 * Liefert die Beschreibung anhand des Titels zurück.
 * @param {*} title
 * @returns
 */
async function axiosAbfrage(title) {
  return axios.get(
    "https://de.wikipedia.org/w/api.php?format=json&exintro=1&action=query&prop=extracts&explaintext=1&exsentences=2&origin=*&titles=" +
      title
  );
}

/**
 * Fügt die übergebenen Elemente in die Datenbank hinzu.
 * @param {*} res
 */
function addPoint(res) {
  // connect to the mongodb database and afterwards, insert one the new element
  client.connect(function (err) {
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

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

/**
 * Überprüft die Syntax, ob diese einem gültigen Link entspricht.
 * Quelle: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 * @param {*} string
 * @returns
 */
function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
