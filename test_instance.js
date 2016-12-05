var db = require("./controllers/databaseConnector.js");

var getInstances = function(req, res){
	var userId = "hahaha";
	var mainQuerySQL = "SELECT instance.id, result.name FROM instance, result WHERE instance.result_id = result.id and instance.user_id = ?;";
  var len;//number of instances
	var result = [];//to be send
	db.query(mainQuerySQL, [userId], function(err, queryResult){
		if(err){
			throw err;
		}
		else{
			//there is some question
			len = queryResult.length;
			for(var i = 0; i < len; i++){
        result[i] = {};
				result[i].instanceId = queryResult[i].id;
				result[i].resultName = queryResult[i].name;
        result[i].symptom = [];
        var symptomQuerySQL = "SELECT instance_symptom.symptom_id, symptom.name FROM instance_symptom, symptom " +
          "WHERE instance_symptom.instance_id = ? AND symptom.id = instance_symptom.symptom_id;";
        console.log(i);
        db.query(symptomQuerySQL,[result[i].instanceId],function(err, queryResult){
          if(err){
            throw err;
          }
          else{
            var length = queryResult.length;
            // result[0].symptom[0] = {};
            // result[0].symptom[0].symptomId = "a";
            // console.log(result[0].symptom);
            console.log(i);
            for(var j = 0; j < length; j++){
              console.log(i, j);
              console.log(result[0]);
              result[i].symptom[j] = {};
              result[i].symptom[j].symptomId = queryResult[j].symptom_id;
              result[i].symptom[j].symptomName = queryResult[j].name;
            }
          }
        });
			}		}
	});




	// for(var i = 0; i < len; i++){
	// 	db.query(symptomQuerySQL,[result[i].instanceId],function(err, queryResult){
	// 		if(err){
	// 			throw err;
	// 		}
	// 		else{
	// 			var length = queryResult.length;
	// 			for(var j = 0; j < length; j++){
  //         result[i].symptom[j] = {};
	// 				result[i].symptom[j].symptomId = queryResult[j].symptom_id;
	// 				result[i].symptom[j].symptomName = queryResult[j].name;
	// 			}
	// 		}
	// 	});
	// }
}

module.exports = getInstances();
