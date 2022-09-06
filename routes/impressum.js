var express = require("express");
var router = express.Router();

/**
 *  GET Impressum
 */
router.get("/", function (req, res, next) {
  res.render("impressum", { title: "Valinor" });
});

module.exports = router;
