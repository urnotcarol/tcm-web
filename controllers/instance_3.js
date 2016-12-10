var db = require("./databaseConnector.js");

exports.insertInstance = function(req, res){
	var userId = req.body.userId;
	var symptomSet = req.body.selectedSymptomId;
	var newSymptom = req.body.newSymptom;
	var isNewResult = req.body.isNewResult;
	var result = req.body.result;
	var instanceDetail = req.body.instanceDetail;
	
	
	var isResultReady = false;
	var isSymptomReady = false;
	
	var resultInfo = "";//以后再说
	var symptomInfo == "";//以后再说
	
	//if the result is new, insert it into "result"
	if(isNewResult){
		var insertResultSQL = "INSERT INTO result(name, user_id, info) VALUES (?, ?, ?);";
		db.connectDB.query(insertResultSQL, [result, userId, resultInfo], function(err, insertResult){
			if(err){
				throw err;
			}
			else{
				if(result.affectedRows === 1){
					//insert new result done
					result = insertResult.insertId;
					isResultReady = true;
				}
			}
		});
	}
	
	//if there is new symptom, insert it
	var newSymptomLength = newSymptom.length;
	if(newSymptomLength !== 0){
		var insertSynptomSQL = "INSERT INTO symptom(name, user_id, info) VALUES (?, ?, ?);";
		var allNewSymptomInsert = newSymptomLength;
		for(var i = 0; i < newSymptomLength; i++){
			db.connectDB.query(insertSQL, [newSymptom[i], userId, symptomInfo],function(err, insertResult){
				if(err){
					throw err;
				}
				else{
					if(result.affectedRows === 1){
						symptomSet.push(insertResult.insertId);
						allNewSymptomInsert--;
					}
				}
			});
		}
		while(allNewSymptomInsert){}
		isSymptomReady = true;
	}
	
	while(isSymptomReady && isResultReady){}//wait for new symptom and new result
	var insertSQL = "INSERT INTO instance(result_id, user_id, detail) VALUES (?, ?, ?);";
	db.query(insertSQL, [resultId, userId, instanceDetail], function(err, queryResult){
		if(err){
			throw err;
		}
		else{
			if(queryResult.affectedRows === 1){
				var instanceId = queryResult.insertId;
				var symptomLength = symptomSet.length;
				var insertSQL = "INSERT INTO instance_symptom(instance_id, symptom_id) VALUES (?, ?);";
				var doneCount = symptomLength;
				for(var i = 0; i < symptomLength; i++){
					db.query(insertSQL, [instanceId, symptomSet[i]], function(err, queryResult){
						if(err){
							throw err;
						}
						else{
							doneCount--;
						}
					});
				}
				while(doneCount){}
				res.send({status: 0});
			}
		}
	});
}