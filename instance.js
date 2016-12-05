e a/*
	management of instance
	getInstances: return all the instances in the dataset (symptoms, result, user_id)
*/

var db = require("./databaseConnector.js");
exports.getInstances = function(req, res){
	var userId = req.body.userId;
	var mainQuerySQL = "SELECT instance.id, result.name, FROM instance, result WHERE instance.result_id = result.id and instance.user_id = ?;";
	var len;//number of instances
	var result;//to be send
	db.query(mainQuerySQL, [userId], function(err, queryResult){
		if(err){
			throw err;
		}
		else{
			//there is some question
			len = queryResult.length;
			for(var i = 0; i < len; i++){
				result[i].instanceId = queryResult[i].id;
				result[i].resultName = queryResult[i].name;
			}
		}
	)};

	var symptomQuerySQL = "SELECT instane_symptom.symptom_id, symptom.name FROM instance_symptom, symptom " +
		"WHERE instance_symptom.instance_id = ? AND symptom.id = instance_symptom.symptom_id;";

	for(var i = 0; i < len; i++){
		db.query(symptomQuerySQL,[result[i].instanceId],function(err, queryResult){
			if(err){
				throw err;
			}
			else{
				var length = queryResult.length;
				for(var j = 0; j < length; j++){
					result[i].symptom[j].symptomId = queryResult[j].symptom_id;
					result[i].symptom[j].symptomName = queryResult[j].name;
				}
			}
		});
	}
	res.send(result);
}
/*
{
	instanceId: id
	resultName: name
	[
	{
		symptomId:id
		symptomName: name
	}
	{
		symptomId:id
		symptomName: name
	}
	]
}
*/


exports.insertInsctance = function(req, res){
	var userId = req.body.userId;
	var resultId = req.body.resultId;
}
