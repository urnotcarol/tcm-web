var db = require("./databaseConnector.js");

exports.displayPage = function(req, res) {
  res.sendfile("views/diagnose.html");
}

exports.diagnose = function(req, res){
	var symptomSet = [];
  for (var i = 0; i < req.body.selectedSymptomId.length; i++) {
    symptomSet.push(parseInt(req.body.selectedSymptomId[i], 10));
  }
	var userId = req.body.userId;
	var result = [];
	var priorSQL =
					"select result.id as id, "
					+"ltrim(cast(count(result_id)*1.0/(select count(*) from instance) as dec(18, 2)))"
					+" + '%' as ratio "
					+"from result left join instance on result.id = instance.result_id AND result.user_id = ? "
					+"group by result_id,result.id "
					+"ORDER BY result.id ASC;";
	var posteriorProbabilitySQL =
								"SELECT id resultid, "
								+ "ltrim"
								+ "(cast("
								+ "(SELECT COUNT(*) FROM instance, instance_symptom "
								+ "WHERE instance.id = instance_symptom.instance_id "
								+ "AND instance.result_id = resultid "
								+ "AND instance_symptom.symptom_id = ? "
								+ "AND instance.user_id = ?) "
								+ "*1.0/"
								+ "(SELECT COUNT(*) FROM instance "
								+ "WHERE instance.result_id = resultid "
								+ "AND instance.user_id = ?) "
								+ "as dec(18, 2)"
								+ ")) "
								+ "+ '%' as ratio "
								+ "FROM result "
								+ "WHERE user_id = ? "
								+ "ORDER BY id ASC;";
	var queryResultSQL = "SELECT name, info FROM result WHERE id = ?;";

  var labelProbabilitySet;

	var findMaxLabel = function(){
			//在labelProbabilitySet里寻找概率最大的前n项
			var n = 3;//返回概率最大结果的个数
			var a = 0;
      labelProbabilitySet.sort(function(x, y) {
        if(x.ratio > y.ratio) {
          return -1;
        } else {
          return 1;
        }
      })

			for(var i = 0; i < n; i++){
				result[i] = {};
				result[i].id = labelProbabilitySet[i].id;
				result[i].ratio = labelProbabilitySet[i].ratio;
				db.connectDB.query(queryResultSQL, [result[i].id], function(err, labelResult){
					if(err){
						throw err;
					}
					else{
						result[a].name = labelResult[0].name;
						result[a].info = labelResult[0].info;
            if (a++ === n - 1){
              console.log("排序结果:::", result);
              res.send(result);
              //return result;
    				}
					}
				});
			}
	}

	db.connectDB.query(priorSQL, [userId], function(err, priorProbabilitySet){
		if(err){
			throw err;
		}
		else{
			labelProbabilitySet = priorProbabilitySet;//复制结果集，在后面多次相乘之后得到总概率
			var labelLength = labelProbabilitySet.length;//结果个数
      console.log("先验概率:\n", labelProbabilitySet);
			//针对每一个症状计算所有label的后验概率posteriorProbability
			var symptomLength = symptomSet.length;//诊断症状总数
			var n = symptomLength;//计数，为零时所有症状都已经正确计算
			for(var i = 0; i < symptomLength; i++){
				db.connectDB.query(posteriorProbabilitySQL, [symptomSet[i], userId, userId, userId], function(err, posteriorProbabilitySet){
					if(err){
						throw err;
					}
					else{
            //console.log(posteriorProbabilitySet);
            labelProbabilitySet.sort(function(x, y) {
              if(x.id < y.id) {
                return -1;
              } else {
                return 1;
              }
            })
						//针对每一个label结算该症状的后验概率
						for(var j = 0; j < labelLength; j++) {
							if(labelProbabilitySet[j].id == posteriorProbabilitySet[j].resultid){
                //console.log("结果:", labelProbabilitySet[j].id);
                //console.log("原概率:", labelProbabilitySet[j].ratio,  "乘:",posteriorProbabilitySet[j].ratio);
								labelProbabilitySet[j].ratio *= posteriorProbabilitySet[j].ratio;
							}
							else{
								//出错了
							//	console.log("oh no! something wrong is happening in posteriorProbability!", labelProbabilitySet[j].id, posteriorProbabilitySet[j].id);
							}
						}
            if(--n === 0){
              console.log("done.");
              console.log("label:::", labelProbabilitySet);
              findMaxLabel();
              //console.log("finalRes: ", finalRes);
              //res.send(finalRes);
            }

					}
				});
			}

			/* while(allSymptomDone){}//等待所有症状完成计算
			//在labelProbabilitySet里寻找概率最大的前n项
			var n = 3;//返回概率最大结果的个数
			var allResultDone = n;
			for(var i = 0; i < n; i++){
				//把第i到第n项中最大的换到第i项
				for(var j = i; j < labelLength - 1; j++){
					//交换
					if(labelProbabilitySet[i].ratio < labelProbabilitySet[j].ratio){
						var temp = labelProbabilitySet[i];
						labelProbabilitySet[i] = labelProbabilitySet[j];
						labelProbabilitySet[j] = temp;
					}
				}
				result[i] = {};
				result[i].id = labelProbabilitySet[i].id;
				result[i].ratio = labelProbabilitySet[i].ratio;
				db.connectDB.query(queryResultSQL, [result[i].id], function(err, labelResult){
					if(err){
						throw err;
					}
					else{
						result[i].name = labelResult.name;
						result[i].info = labelResult.info;
						allResultDone--;
					}
				});
			}
			while(allResultDone){}
			res.send(result); */
		}
	});
}
/*
priorProbabilitySet:
[{id, radio},{id,radio}]
*/
/* priorProbabilitySet




for one symptom:
"SELECT COUNT(*) FROM instance, instance_symptom WHERE instance.id = instance_symptom.instance_id AND instance.result_id = ? AND instance_symptom.symptom_id = ?)"
"(SELECT COUNT(*) FROM instance, instance_symptom WHERE instance.id = instance_symptom.instance_id AND instance.result_id = ?)"

p(syptom/result) */
