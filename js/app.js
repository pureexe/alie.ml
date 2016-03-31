var apiServer = "https://api.alie.ml"
$(document).ready(function(){
  $("#login-btn").click(function(){
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me?fields=email,name,first_name,last_name', function(response) {
          localStorage.player = response.id
          date = (new Date()).toISOString();
          try{
            $.post(apiServer+"/Players", {
              id: response.id,
              name: response.name,
              firstname: response.first_name,
              lastname:response.last_name,
              email:response.email,
              updated_time:date
            }).done(function() {
              localStorage.player = response.id
              window.location="thread.html";
            }).fail(function() {
              localStorage.player = response.id
              window.location="thread.html";
            });
          catch(e){
            // do nothing
          }
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
