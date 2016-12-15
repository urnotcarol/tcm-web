/*
		management of symptom and result
	getFeatures: return all symptoms or results in the databaseConnector
	addSymptom: insert one symptom
	addResult: insert one result
*/

var db = require("./databaseConnector.js");

//get symptoms
exports.getSymptoms = function(req, res){
  var userId = req.body.userId;
	var querySQL = "SELECT id, name FROM symptom WHERE user_id = ? OR user_id = ? order by id asc;";
	db.connectDB.query(querySQL, [userId, db.publicUserId],function(err,result){
		if(err){
			throw err;
		}
		else{
      // console.log(result);
			res.send(result);
		}
	});
}

//get results
exports.getResults = function(req, res){
  var userId = req.body.userId;
	var querySQL = "SELECT id, name FROM result WHERE user_id = ? OR user_id = ? order by id asc;";
	db.connectDB.query(querySQL, [userId, db.publicUserId], function(err,result){
		if(err){
			throw err;
		}
		else{
			res.send(result);
		}
	});
}



//add symptom
exports.addSymptom = function(req, res){
	var symptomName = req.body.symptomName;
	var userId = req.body.userId;
	var symptomInfo = req.body.symptomInfo;
	var insertSQL = "INSERT INTO symptom(name, user_id, info) VALUES (?, ?, ?);";
	db.connectDB.query(insertSQL, [symptomName, userId, symptomInfo],function(err, result){
		if(err){
			throw err;
		}
		else{
			if(result.affectedRows === 1){
				res.send({status: 0});
			}
		}
	});
}

//add result
exports.addResult = function(req, res){
	var resultName = req.body.resultName;
	var userId = req.body.userId;
	var resultInfo = req.body.resultInfo;
	var insertSQL = "INSERT INTO result(name, user_id, info) VALUES (?, ?, ?);";
	db.connectDB.query(insertSQL, [resultName, userId, resultInfo], function(err, result){
		if(err){
			throw err;
		}
		else{
			if(result.affectedRows === 1){
				res.send({status: 0});
			}
		}
	});
}
