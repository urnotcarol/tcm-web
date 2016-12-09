var express = require("express");
var diagnose = require("../controllers/diagnose.js");
var feature = require("../controllers/feature.js")
var router = express.Router();

router.get("/", diagnose.displayPage);
router.post("/getSymptoms", feature.getSymptoms);

module.exports = router;
