var db = require("./databaseConnector.js");
db.connectDB.connect();

exports.displayPage = function(req, res) {
  res.sendfile("views/instance.html");
}

exports.getSymptoms = function(req, res){
  var userId = req.body.userId;
	var querySQL = "SELECT id, name FROM symptom WHERE user_id = ? OR user_id = ?;";
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
	var querySQL = "SELECT id, name FROM result WHERE user_id = ? OR user_id = ?";
	db.connectDB.query(querySQL, [userId, db.publicUserId], function(err,result){
		if(err){
			throw err;
		}
		else{
			res.send(result);
		}
	});
}


exports.addInstance = function(req, res){
	var userId = req.body.userId;
	var symptomSet = req.body.selectedSymptomId;
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
          console.log("begin resultQuery");
          console.log("hehe ", insertResult.affectedRows);
					//insert new result done
					result = insertResult.insertId;
					isResultReady = true;
          // res.send("a")
				}
			}
		});
	} else {
    isResultReady = true;
  }

	//if there is new symptom, insert it

  var testFoo = function() {
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
            console.log("i:", i);
            console.log("instanceId:", instanceId, "symptomSet:", symptomSet[i]);
            db.connectDB.query(insertSQL, [instanceId, symptomSet[i]], function(err, queryResult){
              console.log("query i: ", i);
              if(err){
                throw err;
              }
              else{
                console.log("donecount:", doneCount);
                doneCount--;
                if (doneCount === 0) {
                  console.log("res send");
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
    console.log("begin newSymptom");
		var insertSynptomSQL = "INSERT INTO symptom(name, user_id, info) VALUES (?, ?, ?);";
		var allNewSymptomInsert = newSymptom.length;
		for(var i = 0; i < newSymptom.length; i++){
			db.connectDB.query(insertSynptomSQL, [newSymptom[i], userId, symptomInfo],function(err, insertResult){
				if(err){
					throw err;
				}
				else{
					if(insertResult.affectedRows === 1){
						//symptomSet.push(insertResult.insertId);
						if(--allNewSymptomInsert === 0) {
              testFoo();
            }
					}
				}
			});
		}
		isSymptomReady = true;
	} else {
    isSymptomReady = true;
  }




	// while(!isSymptomReady || !isResultReady){}//wait for new symptom and new result
  // console.log("isSymptomReady:", isSymptomReady, "isResultReady:", isResultReady);
  // console.log("begin insert");
	// var insertSQL = "INSERT INTO instance(result_id, user_id, detail) VALUES (?, ?, ?);";
	// db.connectDB.query(insertSQL, [result, userId, instanceDetail], function(err, queryResult){
	// 	if(err){
	// 		throw err;
	// 	}
	// 	else{
	// 		if(queryResult.affectedRows === 1){
	// 			var instanceId = queryResult.insertId;
	// 			var symptomLength = symptomSet.length;
	// 			var insertSQL = "INSERT INTO instance_symptom(instance_id, symptom_id) VALUES (?, ?);";
	// 			var doneCount = symptomLength;
	// 			for(var i = 0; i < symptomLength; i++){
  //         console.log("i:", i);
  //         console.log("instanceId:", instanceId, "symptomSet:", symptomSet[i]);
	// 				db.connectDB.query(insertSQL, [instanceId, symptomSet[i]], function(err, queryResult){
  //           console.log("query i: ", i);
	// 					if(err){
	// 						throw err;
	// 					}
	// 					else{
  //             console.log("donecount:", doneCount);
	// 						doneCount--;
	// 					}
	// 				});
	// 			}
	// 			while(doneCount){}
  //       console.log("res send");
	// 			res.send({status: 0});
	// 		}
	// 	}
	// });
}
