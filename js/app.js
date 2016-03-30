var apiServer = "http://api.alie.ml"
$(document).ready(function(){
  $("#login-btn").click(function(){
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me?fields=email,name,first_name,last_name', function(response) {
          date = (new Date()).toISOString();
          $.post(apiServer+"/Players", {
            id: response.id,
            name: response.name,
            firstname: response.first_name,
            last_name:response.last_name,
            updated_time:date
          }).done(function() {
              //new user give some tutorial
          }).fail(function() {
              //skip tutorial
          });
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'email,public_profile,user_friends'});
  })
  $("html").on("fbLoaded",function(){
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log("logedin?");
      }
      else {
        $("#login-page").show();
        console.log("triggered");
      }
    });
  });
});
