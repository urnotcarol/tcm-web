var db = require("./databaseConnector.js");

exports.displayPage = function(req, res) {
  res.sendfile("views/instance.html");
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


	var isResultReady = false;
	var isSymptomReady = false;

	var resultInfo = "";//以后再说
	var symptomInfo = "";//以后再说

	//if the result is new, insert it into "result"
	if(isNewResult === "true"){
    console.log("begin newResult");
		var insertResultSQL = "INSERT INTO result(name, user_id, info) VALUES (?, ?, ?);";
		db.connectDB.query(insertResultSQL, [result, userId, resultInfo], function(err, insertResult){
			if(err){
				throw err;
			}
			else{
				if(insertResult.affectedRows === 1){
					//insert new result done
					result = insertResult.insertId;
					isResultReady = true;
				}
			}
		});
	} else {
    isResultReady = true;
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
	}
}
