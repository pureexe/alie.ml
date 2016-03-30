$(document).ready(function(){
  $("html").on("fbLoaded",function(){
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log("logedin?")
      }
      else {
        $("#login-page").show();
        console.log("triggered")
      }
    });
  });
});
