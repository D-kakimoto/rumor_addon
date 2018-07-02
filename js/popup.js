//onload処理
window.onload = function() {
  document.getElementById("addonIntro").addEventListener("click",move_intro,false);
  //→リスト項目
  list_set();
  document.getElementById("find_rumor_content").addEventListener("click",sendToContents,false);
  //→設定項目
  document.getElementById("pUpStatus").addEventListener("click",setting_update_status,false);
  document.getElementById("pClStatus").addEventListener("click",setting_cancel_status,false);
  //document.getElementById("pUpOpts").addEventListener("click",move_options,false);
  document.getElementById("reportstatus").addEventListener("click",report_post_status,false);
  document.getElementById("reportclstatus").addEventListener("click",report_cancel_status,false);
}

/****************アドオン紹介ページへのリンク****************/
//「RumorFinder」が押された時
function move_intro(){
  window.open(
    "http://www2.yoslab.net/~kakimoto/addon_intro/index.html"
  );
}


/****************リスト項目****************/
function list_set(){
  //現在のタブのURLから流言検出数を取得しリストを書き換え
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var data = JSON.parse(localStorage.getItem(tabs[0].url));
    var rumorcount;
    if(!data){
      rumorcount = 0;
    }else{
      rumorcount = data.count;
    }
    var div_count = document.getElementById("find_rumor_count");
    if(rumorcount > 0){
      div_count.innerHTML = "このページで"+rumorcount+"件の流言を検出";
      $(div_count).css("color", "red");
      var div_list = document.getElementById("find_rumor_content");
      for(var i=0;i<rumorcount;i++){
        var insert_div = document.createElement('div');
        insert_div.classList.add('ttl');
        insert_div.textContent = data[i];
        div_list.appendChild(insert_div);
      }
    }else{
      div_count.innerHTML = "このページでは流言は検出されませんでした"
    }
  });
}

//検出流言の参照(→contentscript)
function sendToContents(e){
  var rumor = e.target.innerHTML;
  var current_click = localStorage.getItem("current_click");
  //同じ流言がクリックされた
  if(current_click && current_click == rumor){
    var count = localStorage.getItem("current_click_count");
    count++;
    localStorage.setItem("current_click_count",count);
    chrome.tabs.query({ active: true, currentWindow: true },
      function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {type:"pop_click_same", rumor:rumor ,count:count},
          function (response) {
            console.log(response);
            if(response == "break"){
              localStorage.setItem("current_click_count",0);
            }
          }
        );
      }
    );
  //別の流言がクリックされた
  }else{
    var old_rumor = localStorage.getItem("current_click");
    chrome.tabs.query({ active: true, currentWindow: true },
      function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {type:"pop_click_diff", rumor:rumor, old_rumor:old_rumor},
          function (response) {
          }
        );
      }
    );
    localStorage.setItem("current_click",rumor);
    localStorage.setItem("current_click_count",0);
  }
}


/****************「設定」項目****************/
//オプション(ユーザ設定)情報の取得
chrome.storage.local.get(
  ["hlop", "tstop", "fukiop","colorop","evalop"],
  function(value){
    var hlop = value.hlop;
    var tstop = value.tstop;
    var fukiop = value.fukiop;
    var colorop = value.colorop;
    var evalop = value.evalop;
    set_radio_button(hlop,tstop,fukiop,colorop,evalop);
});

//オプション情報をもとにラジオボタンにチェックを入れる
function set_radio_button(hlop,tstop,fukiop,colorop,evalop){
  //hlopについて
  var element_hl = document.getElementById("hl-op");
  var elements_hl = element_hl.highlightonoff;
  if(hlop != "off"){
    elements_hl[0].checked = true;
  }else{
    elements_hl[1].checked = true;
  }
  //tstopについて
  var element_tst = document.getElementById("tst-op");
  var elements_tst = element_tst.toastonoff;
  if(tstop != "off"){
    elements_tst[0].checked = true;
  }else{
    elements_tst[1].checked = true;
  }
  //fukiopについて
  var element_fuki = document.getElementById("fuki-op");
  var elements_fuki = element_fuki.fukionoff;
  if(fukiop != "off"){
    elements_fuki[0].checked = true;
  }else{
    elements_fuki[1].checked = true;
  }
  //hlcolorについて
  var element_color = document.getElementById("color-op");
  var elements_color = element_color.hlcolor;
  if(colorop == "red"){
    elements_color[0].checked = true;
  }else if(colorop == "blue"){
    elements_color[2].checked = true;
  }else{
    elements_color[1].checked = true;
  }
  //evalopについて
  var element_eval = document.getElementById("eval-op");
  var elements_eval = element_eval.evalonoff;
  if(evalop == "on"){
    elements_eval[0].checked = true;
  }else{
    elements_eval[1].checked = true;
  }
}

//「設定する」が押された時
function setting_update_status(){
  var element_1 = document.getElementById("hl-op") ;
  var radioNodeList_1 = element_1.highlightonoff;
  var value_1 = radioNodeList_1.value;
  var element_2 = document.getElementById("tst-op") ;
  var radioNodeList_2 = element_2.toastonoff;
  var value_2 = radioNodeList_2.value;
  var element_3 = document.getElementById("fuki-op") ;
  var radioNodeList_3 = element_3.fukionoff;
  var value_3 = radioNodeList_3.value;
  var element_4 = document.getElementById("color-op") ;
  var radioNodeList_4 = element_4.hlcolor;
  var value_4 = radioNodeList_4.value;
  var element_5 = document.getElementById("eval-op") ;
  var radioNodeList_5 = element_5.evalonoff;
  var value_5 = radioNodeList_5.value;
  chrome.storage.local.set(
    {'hlop': value_1,'tstop': value_2,'fukiop': value_3,'colorop':value_4,'evalop':value_5},
    function (){
      console.log("設定を保存しました");
    }
  );
  window.close();
}
//「キャンセル」が押された時
function setting_cancel_status(){
  window.close();
}
//「詳細設定」が押された時
function move_options(){
  window.open(
    chrome.extension.getURL("../html/options.html")
  );
}

/******************************************/
/****************「報告」項目****************/
var URL;
//現在のタブのURLを取得
chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    URL = tabs[0].url;
});

//「送信」が押された時
function report_post_status(){
  var report_text = document.getElementById("report-text-contents").value;
  if(report_text){
    chrome.runtime.sendMessage(
      {type: "report",name:"report",URL:URL,text:report_text},
      function (response){}
    );
    window.close();
  }
}

//「キャンセル」が押された時
function report_cancel_status(){
  window.close();
}

/****************「報告」項目****************/
