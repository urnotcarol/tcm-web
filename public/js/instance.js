$(function() {
  $("#add-instance").on("click", function() {
    $("#add").show();
    location.href = "#add";
  })

  $.ajax({
    type: "POST",
    url: "/instance/getInstance",
    data: {
      userId: "8848dbl"
    },
    success: function(result) {
      console.log(result);
    }
  })

  $.ajax({
    type: "POST",
    url: "/instance/add/getSymptoms",
    data: {
      userId: "8848dbl"
    },
    success: function(symptoms) {
      symptoms.forEach(function(elem) {
        $("#symptoms").append('<button type="button" class="btn btn-info btn-sm" data-symptom-id=' + elem.id + '>' + elem.name + '</button>');
      });

      $("#symptoms button").on("click", function() {      //单击症状按钮时该症状添加到已选队列,并变为禁用状态
        $("#tags-selected").tagsinput("add", $(this).html());
        $(this).attr("disabled", "disabled");
      });
    }
  });

  $.ajax({
    type: "POST",
    url: "/instance/add/getResults",
    data: {
      userId: "8848dbl"
    },
    success: function(results) {
      results.forEach(function(elem) {
        $("#results").append('<button type="button" class="btn btn-info btn-sm" data-result-id=' + elem.id + '>' + elem.name + '</button>')
      });

      $("#results button").on("click", function() {      //单击结果按钮时该结果添加到结果栏,其他按钮变为禁用状态
        $("#tags-result").tagsinput("add", $(this).html());
      });
    }
  });

  $("#tags-selected").on("itemRemoved", function(event) {
    $("#symptoms").children("button").each(function() {
      if($(this).html() === event.item) {
        $(this).removeAttr("disabled");
      }
    });
  });

  $("#submit-add").on("click", function() {
    var selectedSymptomId = [];
    var newSymptom = [];
    var isNewResult = true;
    var result;

    $("#tags-selected").tagsinput("items").forEach(function(elem) {
      var isNewSymptom = true;
      $("#symptoms button").each(function() {
        if($(this).html() === elem) {
          isNewSymptom = false;
          selectedSymptomId.push($(this).data("symptom-id"));
          return false;
        }
      });
      if(isNewSymptom) {
        newSymptom.push(elem);
      }
    });

    var tempResult = $("#tags-result").tagsinput("items")[0];
    $("#results button").each(function() {
      if ($(this).html() === tempResult) {
        isNewResult = false;
        result = $(this).data("result-id");
        return false;
      }
    });

    if(isNewResult) {
      result = tempResult;
    }

    $.ajax({
      type: "POST",
      url: "/instance/add/addInstance",
      data: {
        "userId": "8848dbl",
        "selectedSymptomId": selectedSymptomId,
        "newSymptom": newSymptom,
        "isNewResult": isNewResult,
        "result": result,
        "instanceDetail": $("#instance-detail").val()
      },
      success: function(result) {
        // if(result.status === "0") {
          alert("添加成功!");
          location.reload();
        // }
      }
    })
  });



  $("#submit-reset").on("click", function() {       //单击重置按钮时隐藏诊断结果、清空已选症状并恢复症状按钮
    $("#tags-selected, #tags-result").tagsinput("removeAll");
    $("#symptoms button, #results button").removeAttr("disabled");
  });

  $("#tags-selected").tagsinput({
    trimValue: true
  });

  $("#tags-result").tagsinput({
    maxTags: 1
  });

  $("#tags-selected").on("itemAdded", function(event) {
    $("#symptoms button").each(function() {
      if($(this).html() === event.item) {
        $(this).attr("disabled", "disabled");
      }
    });
  });

  $("#tags-result").on("itemAdded", function(event) {
    $("#results button").attr("disabled", "disabled");
  });


  $("#tags-result").on("itemRemoved", function(event) {
    $("#results").children("button").removeAttr("disabled");
  });
});
