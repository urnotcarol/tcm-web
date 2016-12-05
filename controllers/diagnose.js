var db = connection = require("./databaseConnector.js");

exports.displayPage = function(req, res) {
  res.sendfile("views/diagnose.html");
}
