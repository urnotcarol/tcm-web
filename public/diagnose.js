$(function() {
  var symptoms = ["头痛", "发热", "恶寒", "咳嗽", "出汗", "无汗", "畏寒", "食欲不振"];
  var mapedSymptoms = symptoms.map(function(elem, i) {
    return {"id": i, "name": elem};
  })

  mapedSymptoms.forEach(function(elem) {
    $("#symptoms").append('<button type="button" class="btn btn-info btn-sm" data-symptom-id=' + elem.id + '>' + elem.name + '</button>');
  });

  var test = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: mapedSymptoms
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

  $("#symptoms button").on("click", function() {      //单击症状按钮时该症状添加到已选队列,并变为禁用状态
    $("#tags-selected").tagsinput("add", {"id": $(this).data("symptom-id"), "name": $(this).html()});
    $(this).attr("disabled", "disabled");
  });

  $("#submit-selected").on("click", function() {
    console.log($("#tags-selected").tagsinput('items'));
    $("#div-result").show();
  })

  $("#submit-reset").on("click", function() {       //单击重置按钮时隐藏诊断结果、清空已选症状并恢复症状按钮
    $("#div-result").hide();
    $("#tags-selected").tagsinput("removeAll");
    $("#symptoms button").removeAttr("disabled");
  })

});
