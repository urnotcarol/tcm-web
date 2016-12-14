var express = require("express");
var instance = require("../controllers/instance.js");
var feature = require("../controllers/feature.js")
var router = express.Router();

router.get("/", instance.displayPage);
router.post("/getInstance", instance.getInstance);
router.post("/add/getSymptoms", feature.getSymptoms);
router.post("/add/getResults", feature.getResults);
router.post("/add/addInstance", instance.addInstance);

module.exports = router;
