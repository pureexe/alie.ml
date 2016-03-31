var apiServer = "https://api.alie.ml"
var me = localStorage.player;
var getNameFromId = function(id,callback){
  $.getJSON(apiServer+"/Players/"+id+"?filter[fields][name]=true",function(result){
    callback(result.name);
  }).fail(function(){
    callback("ผิดพลาด กรุณาโหลดหน้าใหม่");
  });
}
var genThreadList = function(data){
  out=""
  var finished = function(){
    $("#preloader").hide();
    $("#thread-list").html(out);
    $("#thread-list").show();
  }
  var genlist = function(c){
    if(!c){
      finished();
    }else{
      if(me==c.from){
        getNameFromId(c.to,function(name){
          console.log("CB: "+name)
          out+="<a class='waves-effect' style='width: 100%;' href='chat.html?thread="+c.id+"'><div style='padding:20px;border-bottom:solid 1px  #ccc;font-size:1.1rem;'>";
          out+=name;
          out+="</div></a>";
          genlist(data.shift());
        });
      }else{
        out+="<a class='waves-effect' style='width: 100%;' href='chat.html?thread="+c.id+"'><div style='padding:20px;border-bottom:solid 1px  #ccc;font-size:1.1rem;'>";
        out+=c.name;
        out+="</div></a>";
        genlist(data.shift());
      }
    }
  }
  genlist(data.shift());
}
$(document).ready(function(){
  $.getJSON(apiServer+"/Threads?filter[where][or][0][from]="+me+"&filter[where][or][1][to]="+me+"&filter[order]=updated_time DESC",function(res){
    genThreadList(res);
  }).fail(function(){
    Materialize.toast('ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้', 4000);
  });
});
