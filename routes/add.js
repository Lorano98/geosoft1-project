var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017"; // connection URL
const client = new MongoClient(url); // mongodb client
const dbName = "mydb"; // database name
const collectionName = "gebirge"; // collection nam

/* GET users listing. */
router.get("/", function (req, res, next) {
  //res.render('poiAnzeigen', { title: 'POI Anzeigen' });
  // connect to the mongodb database and retrieve all docs
  client.connect(function (err) {
    assert.equal(null, err);

    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.find({}).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Found the following records...");
      console.log(docs);
      res.render("add", { title: "Gebirge Anzeigen", data: docs });
    });
  });
});

// Wird ausgeführt, wenn der Speichern Button gedrückt wurde
router.post("/finish", function (req, res, next) {
  if (
    req.body.y == null ||
    req.body.y == "" ||
    req.body.x == null ||
    req.body.x == ""
  ) {
    res.send("Keine Koordinaten vorhanden" + '<br><a href="/add">Zurück</a> ');
  }
  console.log("Punkt hinzugefügt");

  console.log(req.body);

  //geojson
  let gebirge = {
    type: "Feature",
    properties: {
      shape: "Marker",
      name: req.body.name,
      hoehe: req.body.hoehe,
      url: req.body.url,
      beschreibung: "Keine Informationen vorhanden",
      category: "default",
    },
    geometry: {
      type: "gebirgent",
      coordinates: [req.body.y, req.body.x],
    },
  };

  console.log("Parse:");
  console.log(gebirge);

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
});

module.exports = router;
