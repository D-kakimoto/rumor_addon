//現在のページURLを取得
var URL = location.href;

//ページオープン時
window.onload = function(){
	if(op_eval == "on"){
		chrome.runtime.sendMessage(
			{type: "log",name:"open",URL:URL,text:null},
			function (response){}
		);
	}
}

//ページクローズ時
window.addEventListener("beforeunload", function() {
	var URL = location.href;
	if(op_eval == "on"){
		chrome.runtime.sendMessage(
			{type: "log",name:"close",URL:URL,text:null},
			function (response){}
		);
	}
	//localstorage解放
  window.localStorage.removeItem(URL);
}, false);

//各操作時
function eval_post(type,URL,rumortext){
	if(op_eval == "on"){
		chrome.runtime.sendMessage(
			{type: "log",name:type,URL:URL,text:rumortext},
			function (response){}
		);
	}
}
