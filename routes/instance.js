var express = require("express");
var instance = require("../controllers/instance.js");
var feature = require("../controllers/feature.js")
var router = express.Router();

router.get("/", instance.displayPage);
router.post("/add/getSymptoms", instance.getSymptoms);
router.post("/add/getResults", instance.getResults);
router.post("/add/addInstance", instance.addInstance);

module.exports = router;
