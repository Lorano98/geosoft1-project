var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017"; // connection URL
const client = new MongoClient(url); // mongodb client
const dbName = "mydb"; // database name
const collectionName = "gebirge"; // collection nam

var mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

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
router.post("/deleted", function (req, res, next) {
  var id = req.body.id;
  var name = req.body.name;

  //Check if Name exists
  client.connect(function (err) {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    collection
      .find({ _id: new ObjectId(id) })
      .toArray(function (err, docs) {
        console.log(docs);
        if (docs.length >= 1) {
          //if the locations exists and is not in use
          collection.deleteOne({ _id: new ObjectId(id) });
          res.render("deleted", { title: "Gelöscht", data: name });
        } else {
          //if the location does not exist
          res.send("Nix gefunden");
          return;
        }
      });
  });
});

module.exports = router;
