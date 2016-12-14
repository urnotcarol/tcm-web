var db = require("./databaseConnector.js");
db.connectDB.connect();

exports.displayPage = function(req, res) {
  res.sendfile("views/instance.html");
}

exports.getInstance = function(req, res){
	var userId = req.body.userId;
	var mainQuerySQL = "SELECT instance.id, result.name FROM instance, result WHERE instance.result_id = result.id and instance.user_id = ?;";
	var len;//number of instances
	var result = [];//to be send

	var symptomQuerySQL = "SELECT instance_symptom.symptom_id, symptom.name FROM instance_symptom, symptom " +
				"WHERE instance_symptom.instance_id = ? AND symptom.id = instance_symptom.symptom_id;";

	db.connectDB.query(mainQuerySQL, [userId], function(err, queryResult){
		if(err){
			throw err;
		}
		else{
			len = queryResult.length;
      var doneSymptom = 0;
			for(var i = 0; i < len; i++){
				result[i] = {};
				result[i].instanceId = queryResult[i].id;
				result[i].resultName = queryResult[i].name;
				result[i].symptom = [];
				db.connectDB.query(symptomQuerySQL, [result[i].instanceId], function(err, symptomQueryResult){
					if(err){
						throw err;
					}
					else{
						var symptomLength = symptomQueryResult.length;
            // console.log(symptomQueryResult);
						for(var j = 0; j < symptomLength; j++){
							result[doneSymptom].symptom[j] = {};
							result[doneSymptom].symptom[j].symptomId = symptomQueryResult[j].symptom_id;
							result[doneSymptom].symptom[j].symptomName = symptomQueryResult[j].name;
						}
            if(++doneSymptom === len){
            //  console.log(result);
              res.send(result);
            }
					}
				});
			}
		}
	});
}

exports.addInstance = function(req, res){
	var userId = req.body.userId;
	var symptomSet = req.body.selectedSymptomId;
  if(typeof(symptomSet) === "undefined") {
    symptomSet = [];
  }
	var newSymptom = req.body.newSymptom;
	var isNewResult = req.body.isNewResult;
	var result = req.body.result;
	var instanceDetail = req.body.instanceDetail;

	var resultInfo = "";//以后再说
	var symptomInfo = "";//以后再说

	//if the result is new, insert it into "result"
	if(isNewResult === "true"){
    console.log("begin newResult: ", result);
		var insertResultSQL = "INSERT INTO result(name, user_id, info) VALUES (?, ?, ?);";
		db.connectDB.query(insertResultSQL, [result, userId, resultInfo], function(err, insertResult){
			if(err){
				throw err;
			}
			else{
        console.log("insertResult: ", insertResult);
				if(insertResult.affectedRows === 1){
					result = insertResult.insertId;
          insertSymptom();
				}
			}
		});
	}

	//if there is new symptom, insert it
  var insertInstance = function() {
    var insertSQL = "INSERT INTO instance(result_id, user_id, detail) VALUES (?, ?, ?);";
    db.connectDB.query(insertSQL, [result, userId, instanceDetail], function(err, queryResult){
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
            db.connectDB.query(insertSQL, [instanceId, symptomSet[i]], function(err, queryResult){
              if(err){
                throw err;
              }
              else{
                doneCount--;
                if (doneCount === 0) {
                  res.send({status: 0});
                }
              }
            });
          }
        }
      }
    });
  }

  var insertSymptom = function() {
    if(typeof(newSymptom) !== "undefined") {
      var insertSynptomSQL = "INSERT INTO symptom(name, user_id, info) VALUES (?, ?, ?);";
      var allNewSymptomInsert = newSymptom.length;
      for(var i = 0; i < newSymptom.length; i++){
        db.connectDB.query(insertSynptomSQL, [newSymptom[i], userId, symptomInfo],function(err, insertResult){
          if(err){
            throw err;
          }
          else{
            if(insertResult.affectedRows === 1){
              symptomSet.push(insertResult.insertId);
              if(--allNewSymptomInsert === 0) {
                insertInstance();
              }
            }
          }
        });
      }
    } else {
      insertInstance();
    }
  }
}
