$(document).ready(function(){
  $("#login-btn").click(function(){
    FB.login(function(response) {
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function(response) {
          console.log('Good to see you, ' + response.name + '.');
          console.log(response);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {scope: 'email,public_profile,user_friends'});
  })
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
