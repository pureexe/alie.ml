$(document).ready(function(){
  $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
      }
  );
  $("#btn-logout").click(function(){
    localStorage.clear();
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        FB.logout(function(response) {
          window.localtion = "index.html"
        });
      }else{
        window.localtion = "index.html"
      }
   });
  })
});
