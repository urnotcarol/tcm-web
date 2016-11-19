var db = require("./databaseConnector.js");

exports.login = function(req, res) {
	var loginSQL = "SELECT * FROM users WHERE id = '" + req.body.userid + "' and password = '" + req.body.password + "';";
	db.query(loginSQL, function(err, rows){
		if(err) {
			throw err;
		}
		else {
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
	var logupQuerySQL= "SELECT * FROM users WHERE id = '" + req.body.username + "';";
	var logupInsertSQL = "INSERT INTO users " +
		"(id, username, password, gender, phone, identity, info)" +
		"VALUES (?, ?, ?, ?, ?, ?, ?)";
	db.query(logupQuerySQL, function(err, rows) {
		if(err) {
			throw err;
		}
		else {
			if(rows.length === 1){
				//用户已存在
				res.send({
					status: 2001
				})
			}
			else {
				db.query(logupInsertSQL,
				[req.body.id, req.body.username, req.body.password, req.body.gender, req.body.phone, req.body, identity, req.body.info],
				function(err){
					if(err) {
						throw err;
					}
					else {
						//注册成功
						res.send({
							status: 2000
						})
					}
				});
			}
		}
	});
}
