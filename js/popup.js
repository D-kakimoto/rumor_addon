//onload処理
window.onload = function() {
  document.getElementById("addonIntro").addEventListener("click",move_intro,false);
  questionnaire_set();
  //→リスト項目
  list_set();
  document.getElementById("find_rumor_content").addEventListener("click",sendToContents,false);
  //→報告項目
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

/****************アンケートページへのリンクセット****************/
function questionnaire_set(){
  var q_url = "https://docs.google.com/forms/d/e/1FAIpQLSe-nGlaWkq4dI-BciweT9AazyB_hC04egn558gVj92cXLz9XA/viewform?entry.44401136=";
  var q_user_id;
  chrome.storage.sync.get('userid', function(items){
  	q_user_id = items.userid;
    if(q_url){
      chrome.storage.local.get('questionnaire', function(items){
        document.getElementById("questionnaire").addEventListener("click",move_questionnaire,false);
        if(items.questionnaire == "undefined"){
          $('#questionnaire').css({
            "color":"gray",
          });
        }else{
          $('#questionnaire').css({
            "color":"gray",
            "animation":"none"
          });
        }
      });
    }
  });
  //ポップアップにリンクを生成
  function move_questionnaire(){
    window.open(
      q_url + q_user_id
    );
    set_op("questionnaire","done");
  }
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
      div_count.innerHTML = "このページでは流言は検出されませんでした";
      $(".subtitle-list").css({
        "border": "#1e90ff solid",
        "border-width": "0 0 0 5px",
        "font-weight": "bold",
        "margin": "11px 0 3px 0",
        "padding": "0 0 0 5px",
        "display": "block"
      });
      $("#find_rumor_content").css({"display":"none"});
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
    $('#log_please').text("ログの送信にご協力ください");
    $('#log_please').addClass("blink-log");
  }
  op_monitor();
}

//オプションの変更を監視
function op_monitor(){
  $("form").change(function(e){
    var target = $(e.target);
    if(target.attr('name')=="evalonoff"){
      set_op("evalop",target.val());
      if(target.val()=="on"){
        alert("ログ送信にご協力いただき，ありがとうございます．");
        $('#log_please').text("");
        $('#log_please').removeClass("blink-log");
      }else{
        $('#log_please').text("ログの送信にご協力ください");
        $('#log_please').addClass("blink-log");
      }
      //アイコンセット命令
      chrome.runtime.sendMessage(
      	{type: "set_icon"},
      	function (response){
      	}
      );
    }else if(target.attr('name')=="highlightonoff"){
      set_op("hlop",target.val());
    }else if(target.attr('name')=="toastonoff"){
      set_op("tstop",target.val());
    }else if(target.attr('name')=="fukionoff"){
      set_op("fukiop",target.val());
    }else if(target.attr('name')=="hlcolor"){
      set_op("colorop",target.val());
    }
  });
}

//ラジオボタンに変更があればchormestorageへ保存
function set_op(key, value){
  console.log(key, value);
  chrome.storage.local.set(
    {[key]: value},
    function (){
      console.log("設定を保存しました");
    }
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
