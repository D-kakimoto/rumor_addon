/******更新ごとにハイライト(オプション)******/
/***
var body = document.getElementsByTagName("body");
if(typeof MutationObserver !== "undefined"){
	var observer = new MutationObserver(function(e){start();});
	observer.observe(body[0], { childList: true, subtree: true });
} else if(typeof body[0].addEventListener !== ""){
	body[0].addEventListener("DOMNodeInserted", function(e){ console.log("node inserted"); }, false);
}
//更新チェック処理関数
function start(){
	if(flag==2){
		flag=0;//更新直後状態→更新受付状態にする
	}else if(flag==0 && rumorlist != undefined){
		//ハイライト処理
		flag=1;
		console.log("更新");
		var lines = rumorlist.split("\n");
		var len = lines.length;//lenは配列の個数
		for(var n = 0; n < len; n++){
			array.push(lines[n]);
		}
		var htmlString = document.documentElement.outerHTML || document.documentElement.innerHTML;
		var text = removeTag(htmlString);
		search(text,lines);
		fukidashi();
		flag=2;//更新直後状態にする
	}
}
***/
/****************************************/


//twitterアカウント情報をbackgroundに要求→ID,passとfolloweeを取得
chrome.runtime.sendMessage({method: "getLocalStorage", key: "status"}, function(response) {
  twitterID = response.twitterID;
  twitterpasswd = response.twitterpasswd;
  if(followee[0]){
  	followee = response.followees.split(",");
  }
});


//表示オプション情報格納
//chrome.runtime.sendMessage({method: "getLocalStorage", key: "status"}, function(response) {
//  var fuki = response.fuki;
//});

//右クリック時のため
function syousai(num,tnum){
	chrome.runtime.sendMessage(
		{type: "syousaisend", text:num, text2:tnum}
	);
}
