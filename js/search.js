var apiServer = "https://api.alie.ml";
var me = localStorage.player;
if(!me){
  window.location="index.html";
}
var searchRender = function(data){
  var output = "";
  if(data.length==0){
    output = "<div class='col s12 valign-wrapper' style='width:100%;height:100%;'><div class='valign center' style='width:100%;'><div><a class='btn-floating btn-large waves-effect waves-light red'><i class='material-icons'>priority_high</i></a></div><div><p>ไม่พบผลการค้นหาที่ต้องการ<br/>โปรดลองชวนคนที่ต้องการคุยด้วยมาเล่นแอปนี้</p></div></div></div>";
  }else {
    data.forEach(function(r){
      output+="<div class='col l4 m6 s12 waves-effect waves-light''><a href='chat.html?with="+r.id+"'><div class='card light-green lighten-4'><div style='padding:10px;'><div class='row' style='margin:0px;'><div class='col s3'><img src='https://graph.facebook.com/"+r.id+"/picture' class='circle responsive-img' /></div><div class='col s9'><span style='font-size: 1.1rem;'>"+r.name+"</span></div></div></div></div></a></div>";
    })
  }
  $("#search-render").html(output);
}
$(document).ready(function(){
  $("#search-input").keyup(function(){
    var name = $("#search-input").val();
    if(name!=""){
      $.getJSON(apiServer+"/Players?filter[where][name][regexp]=/"+name+"/i&filter[limit]=18&filter[fields][id]=true&filter[fields][name]=true",function(response){
        searchRender(response)
      });
    }
  });
})
