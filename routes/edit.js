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

// Wird ausgeführt, wenn der Löschen Button gedrückt wurde
//Post Location - this post operation can be used to store new locations in the locations collection
router.post("/finish", function (req, res, next) {
  var name = req.body.name;

  //Check if Name exists
  client.connect(function (err) {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection.find({ "properties.name": name }).toArray(function (err, docs) {
      console.log("Gefunden:");
      console.log(docs);

      if (docs.length >= 1) {
        //if the locations exists and is not in use
        collection.deleteOne(
          { "properties.name": name },
          function (err, results) {
            //delte the location from the locations collection
          }
        );
        res.render("deleted", { title: "Gelöscht", data: name });
        return;
      } else {
        //if the location does not exist
        res.send(
          `Das POI existiert nicht` + '<br><a href="/poiLoeschen">Zurück</a> '
        );
        return;
      }

      collection.deleteOne({ name: name }, function (err, results) {
        res.render("deleted", { title: "Gelöscht", data: name });
      });
    });
  });
});

module.exports = router;
