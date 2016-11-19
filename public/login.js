$(function() {
  $("#login").on("click", function(evt) {
    evt.preventDefault();
    var userid = $("#userid").val();
    var password = $("#password").val();

    if(userid.length === 0 || password.length === 0){
      $("#inputHint").html("用户名或密码不能为空呦~");
    }
    else if(userid.length < 6 || password.length < 6){
      $("#inputHint").html("用户名和密码不能少于6位");
    }
    else{
      $.ajax({
        type: "POST",
        url: "login",
        data: {
          userid: userid,
          password: password
        },
        success: function(result) {
          console.log(result);
          if(result.status === 1000) {
            location.href = "/diagnose";
          } else {
            $("#inputHint").html("密码错误");
          }
        }
      });
  }
  });
});
