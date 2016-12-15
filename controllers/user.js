var db = require("./databaseConnector.js");

exports.login = function(req, res) {
	var loginSQL = "SELECT * FROM users WHERE id = '" + req.body.id + "' and password = '" + req.body.password + "';";
	db.connectDB.query(loginSQL, function(err, rows){
		if(err) {
			throw err;
		}
		else {
      console.log(rows.length === 1);
			if(rows.length === 1) {
				res.send({
					//登录成功
					status: 1000
				});
			}
			else {
				res.send({
					//登录失败：密码错误
					status: 1001
				})
			}
		}
	});
}

exports.logup = function(req, res) {
	var logupQuerySQL= "SELECT * FROM users WHERE id = '" + req.body.id + "';";
	var logupInsertSQL = "INSERT INTO users " +
		"(id, password, gender)" +
		"VALUES (?, ?, ?)";
	db.connectDB.query(logupQuerySQL, function(err, rows) {
		if(err) {
			throw err;
		}
		else {
      console.log(rows);
			if(rows.length === 1){
				//用户已存在
				res.send({
					status: 2001
				})
			}
			else {
				db.connectDB.query(logupInsertSQL, [req.body.id, req.body.password, req.body.gender], function(err){
					if(err) {
						throw err;
					}
					else {
						//注册成功
            console.log("send 2000");
						res.send({
							status: 2000
						})
					}
				});
			}
		}
	});
}
