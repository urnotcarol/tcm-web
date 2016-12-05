// $(function() {
//   $('[data-toggle="radio"]').radiocheck();
//   $("#login").on("click", function(evt) {
//     evt.preventDefault();
//     var userid = $("#userid").val();
//     var password = $("#password").val();
//
//     if(userid.length === 0 || password.length === 0){
//       $("#inputHint").html("用户名或密码不能为空呦~");
//     }
//     else if(userid.length < 6 || password.length < 6){
//       $("#inputHint").html("用户名和密码不能少于6位");
//     }
//     else{
//       $.ajax({
//         type: "POST",
//         url: "login",
//         data: {
//           userid: userid,
//           password: password
//         },
//         success: function(result) {
//           console.log(result);
//           if(result.status === 1000) {
//             location.href = "/diagnose";
//           } else {
//             $("#inputHint").html("密码错误");
//           }
//         }
//       });
//   }
//   });
// });

$(function() {
  $("#nav-login").on("click", function() {
    $("#nav-login").attr("class", "active");
    $("#nav-logup").attr("class", "");
    $("#div-login").show();
    $("#div-logup").hide();
  });
  $("#nav-logup").on("click", function() {
    $("#div-login").hide();
    $("#div-logup").show();
    $("#nav-login").attr("class", "");
    $("#nav-logup").attr("class", "active");
  });

  var idHint = "请输入6-20位由字母或数字组成的ID";
  var passwordHint = "请输入6-20位密码";


  $("#login-id").focus(function() {
    $("#login-id-hint").html(idHint);
  })

  $("#login-id").blur(function() {
    var id = $("#logup-id").val();
    if(id.length <= 6 || id.length >= 20) {
      $("#login-id-hint").html("ID输入有误，请重新输入");
      console.log($("#login-id-hint").parent());
      $("#login-id-hint").parent().addClass("has-warning");
    }
  })

  $("#logup-submit").on("click", function() {
    var id = $("#logup-id").val();
    var password = $("#logup-password").val();
    var confirmPassword = $("#logup-confirm-password").val();
    var username = $("#logup-username").val();
    var gender = $("input[name='logup-gender'][checked]").val();
    var phone = $("#logup-phone").val();




  })
})
