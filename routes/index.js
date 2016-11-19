var express = require("express");
var index = require("../controllers/index.js");
var user = require("../controllers/user.js");
var router = express.Router();

router.get("/", index.displayPage);
router.post("/login", user.login);
router.post("/logup", user.logup);

module.exports = router;
