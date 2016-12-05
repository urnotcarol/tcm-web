/*
		management of symptom and result
	getFeatures: return all symptoms or results in the databaseConnector
	addSymptom: insert one symptom
	addResult: insert one result
*/

var db = require("./databaseConnector.js");

//get symptoms or results
exports.getFeatures = function(req, res){
	var func = req.body.func;// func is "symptom" or "result"
	var querySQL = "SELECT id, name FROM " + func + ";";
	db.query(querySQL, function(err,result){
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
	db.query(insertSQL, [symptomName, userId, symptomInfo],function(err, result){
		if(err){
			throw err;
		}
		else{
			if(result.affectedRows === 1){
				res.send({
					status: 0
				});
			}
		}
	});
}

//add result
exports.addResult = function(req, res){
	var resultName = req.body.resultName;
	var userId = req.body.userId;
	var resultInfo = req.body.resultInfo;
	var insertSQL = "INSERT INTO symptom(name, user_id, info) VALUES (?, ?, ?);";
	db.query(insertSQL, [resultName, userId, resultInfo], function(err, result){
		in(err){
			throw err;
		}
		else{
			if(result.affectedRows === 1){
				res.send({
					status: 0
				});
			}
		}
	});
}

