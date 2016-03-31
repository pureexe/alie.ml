var apiServer = "https://api.alie.ml"
var me = localStorage.player;
if(!me){
  window.location="index.html";
}
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
var NothingToShow = function(){
  out = "";
  out = "<div style='width:100%;height:100%;' class='valign-wrapper'><div style='width:100%;' class='valign center'><div><a class='btn-floating btn-large waves-effect waves-light red' href='https://www.pureapp.in.th/2016/03/how-to-use-alie/' target='_blank'><i class='material-icons'>help_outline</i></a></div><div><p style='font-size:1.1rem;'>ไม่พบรายชื่อผู้ติดต่อ<br/><a target='blank' href='https://www.pureapp.in.th/2016/03/how-to-use-alie/'>คลิกที่นี่</a> เพื่อดูวิธีการใช้งาน</p></div></div></div>";
  $("#preloader").hide();
  $("#thread-list").html(out);
  $("#thread-list").show();
}
$(document).ready(function(){
  $.getJSON(apiServer+"/Threads?filter[where][or][0][from]="+me+"&filter[where][or][1][to]="+me+"&filter[order]=updated_time DESC",function(res){
    if(res.length>0){
      genThreadList(res);
    }else{
      NothingToShow();
    }
  }).fail(function(){
    Materialize.toast('ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้', 4000);
  });
});
