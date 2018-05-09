//ボタンが押された時に実行
window.onload = function() {
  op_check();
  document.getElementById("pUpStatus").addEventListener("click",update_status,false);
  document.getElementById("pClStatus").addEventListener("click",cancel_status,false);
  document.getElementById("pUpOpts").addEventListener("click",move_options,false);
}

//storageを確認して保存情報に基づいてチェックする
function op_check(){

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
  chrome.storage.local.set(
    {'hlop': value},
    function (){
    console.log("設定内容を保存しました");
    }
  );
  //window.close();
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
