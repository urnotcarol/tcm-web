var mysql = require("mysql");

exports.connectDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "heyyoo",
  database: "tcm"
});

exports.publicUserId = "8848dbl";
