var apiServer="https://api.alie.ml"
function gup( name, url ) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}
var thread_id = gup("thread");
var thread_name = "";
var me = localStorage.player;
if(!me){
  window.location="index.html";
}
var meName = "";
var chatwith = gup("with");
var posted = [];
var needshowwho = false;
var updatedThread = function(){
  out = "";
  $.getJSON(apiServer+"/Messages?filter[where][thread_id]="+thread_id+"&filter[order]=id DESC&filter[limit]=5",function(res){
    res = res.reverse();
    res.forEach(function(r){
      if(posted.indexOf(r.id)==-1){
        if(r.message.substring(0,42)=="ระบบ: จริงๆแล้วตัวตนที่แท้จริงของฉันคือ [["){
          tName = r.message.split("[[");
          name = tName[1];
          name = name.substring(0,name.length-2)
          $("#thread-name").text(name);
        }
        if(r.from==me){
          out+="<div style='width:100%;padding:20px;text-align:right;border-bottom:solid 1px  #ccc;'>";
        }else{
          out+="<div style='width:100%;padding:20px;;border-bottom:solid 1px  #ccc;'>";
        }
        out+=r.message
        out+="</div>";
        posted.push(r.id);
      }
    });
    if(out!=""){
      $("#chat-display").append(out);
      var d = $('#chat-display-container');
      d.scrollTop(d.prop("scrollHeight"));
    }
  });
}
var getNameFromId = function(id,callback){
  $.getJSON(apiServer+"/Players/"+id+"?filter[fields][name]=true",function(result){
    callback(result.name);
  }).fail(function(){
    callback("ผิดพลาด กรุณาโหลดหน้าใหม่");
  });
}
var InitThread = function(data){
  var wait = 0;
  var finished = function(){
    if(wait == 0){
      $("#preloader").hide();
      $("#chat-display").show();
      if(needshowwho){
        $("#show-who").show();
      }
      setInterval(updatedThread,2000);
      var d = $('#chat-display-container');
      d.scrollTop(d.prop("scrollHeight"));
    }
  }
  if(data.to==me){
    $("#thread-name").text(data.name);
  }else{
    wait++
    getNameFromId(data.from,function(name){
      meName = name;
      if(name!=data.name){
        needshowwho = true;
      }
      getNameFromId(data.to,function(name){
        $("#thread-name").text(name);
        wait--
        finished();
      });
    });
  }
  wait++
  $.getJSON(apiServer+"/Messages?filter[where][thread_id]="+thread_id+"&filter[order]=id DESC",function(res){
    data = res.reverse();
    out = "";
    data.forEach(function(r){
      if(r.from==me){
        out+="<div style='width:100%;padding:20px;text-align:right;border-bottom:solid 1px  #ccc;'>";
      }else{
        out+="<div style='width:100%;padding:20px;border-bottom:solid 1px  #ccc;'>";
      }
      out+=r.message
      out+="</div>";
      posted.push(r.id);
    });
    $("#chat-display").html(out);
    wait--;
    finished();
  }).fail(function(){
    Materialize.toast('ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้', 4000);
  });
}
if(thread_id){
  $.getJSON(apiServer+"/Threads?filter[where][id]="+thread_id,function(res){
    var thread = undefined
    if(res.length>0){
      thread = res[0];
    }
    if(!(thread.from==me||thread.to==me)){
      window.location = "thread.html";
    }else{
      InitThread(thread);
    }
  }).fail(function(){
    Materialize.toast('ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้', 4000);
  });
}else if(chatwith){
  if(chatwith==me){
    window.location = "thread.html";
  }
  $.getJSON(apiServer+"/Threads?filter[where][from]="+me+"&filter[where][to]="+chatwith,function(response){
    if(response.length==0){
      $('#new-thread-modal').openModal({dismissible:false});
      $("#show-who").show();
    }else{
      InitThread(response[0]);
    }
  })
}else{
  window.location = "thread.html";
}
$("#setname-btn").click(function(){
  var name = $("#new-thread-name").val();
  if(name==""){
    Materialize.toast('ชื่อต้องยาวอย่างน้อย 1 ตัวอักษร!', 4000);
  }else{
    date = (new Date()).toISOString();
    $.post(apiServer+"/Threads",{
      "from": me,
      "to": chatwith,
      "updated_time": date,
      "name":name,
      "unread_count":0
    }, function(res){
      $.getJSON(apiServer+"/Players/"+chatwith+"?filter[fields][name]=true",function(res){
        thread_name = res.name;
        $("#thread-name").text(thread_name);
        $("#preloader").hide();
        $("#chat-display").show();
        setInterval(updatedThread,2000);
        var d = $('#chat-display-container');
        d.scrollTop(d.prop("scrollHeight"));
      });
      $("#new-thread-modal").closeModal();
    }, 'json').fail(function(){
      Materialize.toast('ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้', 4000);
    });
  }
});
var sendMessage = function(msg){
  date = (new Date()).toISOString();
  $.post(apiServer+"/Messages",{
    "thread_id": thread_id,
    "from": me,
    "updated_time": date,
    "message": msg,
  },function(r){
      posted.push(r.id)
      var out=""
      out+="<div style='width:100%;padding:20px;text-align:right;border-bottom:solid 1px  #ccc;'>";
      out+=r.message
      out+="</div>";
      $("#chat-display").append(out);
      var d = $('#chat-display-container');
      d.scrollTop(d.prop("scrollHeight"));
  },'json').fail(function(){
    Materialize.toast('ไม่สามารถส่งข้อความได้', 4000);
  });
}
var toSendMessage = function(){
  var msg = $("#input-message").val();
  $("#input-message").val("");
  sendMessage(msg);
}
$("#input-message").keypress(function(e) {
    if(e.which == 13) {
        toSendMessage();
    }
});
$("#send-msg").click(function(e){
  toSendMessage();
})
$("#show-who").click(function(e){
  $("#show-who-modal").openModal();
});
$("#show-who-btn").click(function(){
  $("#show-who").hide();
  $("#show-who-modal").closeModal();
  sendMessage("ระบบ: จริงๆแล้วตัวตนที่แท้จริงของฉันคือ [["+meName+"]]");
  console.log(thread_id);
  $.post(apiServer+"/Threads/update?where[id]="+thread_id,{
    "id":thread_id,
    "name":meName
  },function(res){

  },"json").fail(function(err){
    console.log(err);
      Materialize.toast('ไม่สามารถเชื่อมต่อกับเซิฟเวอร์ได้', 4000);
  })
});
