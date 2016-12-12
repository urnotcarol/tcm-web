var db = require("./databaseConnector.js");

exports.getInstance = function(req, res){
	/*
	req format:
	{
		userId: userId,
		instanceId: instanceId
	}
	"instanceId" in "req" will not be used in this function
	*/
	var userId = req.body.userId;
	var mainQuerySQL = "SELECT instance.id, result.name FROM instance, result WHERE instance.result_id = result.id and instance.user_id = ?;";
	var len;//number of instances
	var result = [];//to be send
	
	var symptomQuerySQL = "SELECT instane_symptom.symptom_id, symptom.name FROM instance_symptom, symptom " + 
				"WHERE instance_symptom.instance_id = ? AND symptom.id = instance_symptom.symptom_id;";
	
	db.query(mainQuerySQL, [userId], function(err, queryResult){
		if(err){
			throw err;
		}
		else{
			len = queryResult.length;
//			var allQueryDone = len;
			for(var i = 0; i < len; i++){
				result[i] = {};
				result[i].instanceId = queryResult[i].id;
				result[i].resultName = queryResult[i].name;
				result[i].symptom = [];
				db.query(symptomQuerySQL, [result[i].instanceId], function(err, symptomQueryResult){
					if(err){
						throw err;
					}
					else{
						var symptomLength = symptomQueryResult.length;
						for(var j = 0; j < symptomLength; j++){
							result[i].symptom[j] = {};
							result[i].symptom[j].symptomId = symptomQueryResult.symptom_id;
							result[i].symptom[j].symptomName = symptomQueryResult.name;
//							allQueryDone--;

						}
					}
				});
				if(i === len - 1){
					res.send(result);
				}
			}
//			while(allQueryDone){};
//			res.send(result);
			/*
			reslut format:
			
			*/
		}
	});
}

exports.insertInstance = function(req, res){
	var userId = req.body.userId;
	var resultId = req.body.resultId;
	var detail = req.body.detail;
	var symptomSet = req.body.symptomSet;
	var insertSQL = "INSERT INTO instance(result_id, user_id, detail) VALUES (?, ?, ?);";
	/*
		"select @@id;"
		SELECT LAST_INSERT_ID();
	*/
	
	db.query(insertSQL, [resultId, userId, detail], function(err, queryResult){
		if(err){
			throw err;
		}
		else{
			if(queryResult.affectedRows === 1){
				var instanceId;
				db.query("SELECT @@id;", function(err, lastIdResult){
					instanceId = lastIdResult[0].id;
				});
				var symptomLength = symptomSet.length;
				var insertSQL = "INSERT INTO instance_symptom(instance_id, symptom_id) VALUES (?, ?);";
				var doneCount = 0;
				for(var i = 0; i < symptomLength; i++){
					db.query(insertSQL, [instanceId, symptomSet[i].symptomId], function(err, queryResult){
						if(err){
							throw err;
						}
						else{
							doneCount++;
						}
					});
				}
				//wait for every query to finish its work
				while(doneCount !== symptomLength){}
				res.send({status: 0});
			}
		}
	});
}