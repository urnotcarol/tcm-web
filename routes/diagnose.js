var express = require("express");
var diagnose = require("../controllers/diagnose.js");
var router = express.Router();

router.get("/", diagnose.displayPage);

module.exports = router;
