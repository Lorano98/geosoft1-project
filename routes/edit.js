var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017"; // connection URL
const client = new MongoClient(url); // mongodb client
const dbName = "mydb"; // database name
const collectionName = "gebirge"; // collection nam

const axios = require("axios").default; //für Wikipedia

var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

var beschreibung = "test";

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
      res.render("edit", { title: "Gebirge Bearbeiten", data: docs });
    });
  });
});

// Wird ausgeführt, wenn der Speichern Button gedrückt wurde
//Post Location - this post operation can be used to store new locations in the locations collection
router.post("/update_notification", function (req, res, next) {
  let id = req.body.id;
  getBeschreibung(req.body.url);

  // Await hat nicht funktioniert
  setTimeout(function () {
    //Check if Name exists
    client.connect(function (err) {
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      collection.find({ _id: new ObjectId(id) }).toArray(function (err, docs) {
        if (docs.length >= 1) {
          //if the locations exists and is not in use
          collection.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                properties: {
                  name: req.body.name,
                  hoehe: req.body.hoehe,
                  url: req.body.url,
                  beschreibung: beschreibung,
                },
                geometry: {
                  coordinates: [req.body.y, req.body.x],
                },
              },
            },
            { upsert: true }
          );
          res.render("update_notification", {
            title: "Bearbeitet",
            data: req.body.name,
          });
        } else {
          //if the location does not exist
          res.send("Nix gefunden");
          return;
        }
      });
    });
  }, 1500);
});

// Wird ausgeführt, wenn der Löschen Button gedrückt wurde
//Post Location - this post operation can be used to store new locations in the locations collection
router.post("/del_notification", function (req, res, next) {
  let id = req.body.id;
  let name = req.body.name;

  //Check if Name exists
  client.connect(function (err) {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.find({ _id: new ObjectId(id) }).toArray(function (err, docs) {
      if (docs.length >= 1) {
        //if the locations exists and is not in use
        collection.deleteOne({ _id: new ObjectId(id) });
        res.render("del_notification", { title: "Gelöscht", data: name });
      } else {
        //if the location does not exist
        res.send("Nix gefunden");
        return;
      }
    });
  });
});

module.exports = router;

/**
 * Ermittelt die Beschreibung des Gebirges.
 */
async function getBeschreibung(url) {
  // Prüfen, ob Link ungültig ist
  if (!isValidHttpUrl(url)) {
    beschreibung = "Keine Informationen verfügbar";
    // Prüfen, ob der Link kein wikipedialink ist
  } else if (url.indexOf("wikipedia") === -1) {
    beschreibung = "Keine Informationen verfügbar";
  } else {
    let urlArray = url.split("/");
    let title = urlArray[urlArray.length - 1];

    let response = await axiosAbfrage(title);
    // Beschreibung aus der response rausfiltern
    const pageKey = Object.keys(response.data.query.pages)[0];
    beschreibung = response.data.query.pages[pageKey].extract;
  }
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
