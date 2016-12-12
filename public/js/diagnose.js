$(function() {
  $.ajax({
    type: "POST",
    url: "/diagnose/getSymptoms",
    data: {
      userId: "hahaha"
    },
    success: function(symptoms) {
      symptoms.forEach(function(elem) {
        $("#symptoms").append('<button type="button" class="btn btn-info btn-sm" data-symptom-id=' + elem.id + '>' + elem.name + '</button>');
      });

      var test = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: symptoms
      });

      test.initialize();

      $("#tags-selected").tagsinput({
        itemValue: "id",
        itemText: "name",
        typeaheadjs: {
          name: "test",
          displayKey: "name",
          source: test.ttAdapter()
        }
      });

      $("#tags-selected").on("itemRemoved", function(event) {
        $("#symptoms").children("button").each(function() {
          if($(this).html() === event.item.name) {
            $(this).removeAttr("disabled");
          }
        });
      });

      $("#symptoms button").on("click", function() {      //单击症状按钮时该症状添加到已选队列,并变为禁用状态
        $("#tags-selected").tagsinput("add", {"id": $(this).data("symptom-id"), "name": $(this).html()});
        $(this).attr("disabled", "disabled");
      });

      $("#submit-diagnose").on("click", function() {
        var selectedSymptomId = [];
        $("#tags-selected").tagsinput("items").forEach(function(elem) {
          selectedSymptomId.push(elem.id);
        })

        $.ajax({
          type: "POST",
          url: "diagnose/submit",
          data: {
            userId: "hahaha",
            selectedSymptomId: selectedSymptomId
          },
          success: function(result) {
            console.log(result);
            $("#text-result").empty();
            for(var i = 0; i < result.length; i++) {
              $("#text-result").append("可能结果: ", result[i].name, "  概率: ", result[i].ratio, "<br>");
            }
            $("#div-result").show();
          }
        })
      })

      $("#submit-reset").on("click", function() {       //单击重置按钮时隐藏诊断结果、清空已选症状并恢复症状按钮
        $("#text-result").empty();
        $("#div-result").hide();
        $("#tags-selected").tagsinput("removeAll");
        $("#symptoms button").removeAttr("disabled");
      });


    }
  });
});
