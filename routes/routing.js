var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const url = "mongodb://localhost:27017"; // connection URL
const client = new MongoClient(url); // mongodb client
const dbName = "mydb"; // database name
const collectionName = "gebirge"; // collection nam

//Mapbox
/*var mapboxgl = require("mapbox-gl");
var MapboxDirections = require("@mapbox/mapbox-gl-directions");

var directions = new MapboxDirections({
  accessToken: "YOUR-MAPBOX-ACCESS-TOKEN",
  unit: "metric",
  profile: "mapbox/cycling",
});*/

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
      console.log("Found the following records...");
      console.log(docs);
      //Übergeben der geojson an die pug Datei
      res.render("routing", { title: "Route zu Gebirgen", data: docs });
    });
  });
});

module.exports = router;
