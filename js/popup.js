//オプション(ユーザ設定)情報の取得
chrome.storage.local.get(
  ["hlop", "tstop", "fukiop","colorop"],
  function(value){
    var hlop = value.hlop;
    var tstop = value.tstop;
    var fukiop = value.fukiop;
    var colorop = value.colorop;
    set_radio_button(hlop,tstop,fukiop,colorop);
});

//ラジオボタンが押された時に実行
window.onload = function() {
  document.getElementById("pUpStatus").addEventListener("click",update_status,false);
  document.getElementById("pClStatus").addEventListener("click",cancel_status,false);
  document.getElementById("pUpOpts").addEventListener("click",move_options,false);
}

//オプション情報をもとにラジオボタンにチェックを入れる
function set_radio_button(hlop,tstop,fukiop,colorop){
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
}

//「設定する」が押された時
function update_status(){
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
  chrome.storage.local.set(
    {'hlop': value_1,'tstop': value_2,'fukiop': value_3,'colorop':value_4},
    function (){
    console.log("設定内容を保存しました");
    }
  );
  window.close();
}
//「キャンセル」が押された時
function cancel_status(){
  window.close();
}
//「詳細設定」が押された時
function move_options(){
  window.open(
    chrome.extension.getURL("../html/options.html")
  );
}
//設定の保存
/*
chrome.storage.local.set(
  {'key1': value},
  function (){
  console.log("設定内容を保存しました");
  }
);
*/
