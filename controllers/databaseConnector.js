var mysql = require("mysql");

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "heyyoo",
  database: "tcm"
});

module.exports = db;
