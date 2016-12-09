var express = require("express");
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("bower_components/"));
app.use(express.static("public/"));

app.use("/", require("./routes/index.js"));
app.use("/diagnose", require("./routes/diagnose.js"));
app.use("/instance", require("./routes/instance.js"));

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("listening at http://%s:%s", host, port);
});
