//Twitterアカウント情報が入力されているかどうかのチェック
if(localStorage["twitterID"] != undefined　&& localStorage["twitterID"] != ""){
  console.log(localStorage["twitterID"]);
}else{
  console.log("TwitterIDが入力されていません");
}

$(function(){
  //Twitterアカウント情報入力済みの処理
  if (localStorage["twitterID"] && localStorage["twitterpasswd"]) {
    $(".twitterID").text('TwitterID :' + localStorage["twitterID"]);
    $(".twitterpasswd").text('Twitterパスワード :' + localStorage["twitterpasswd"]);
    $(".setbutton").html('<input id="clear" type="button" value="解除">');
  }
  //Twitterアカウント情報未入力時の処理
  else{
    $(".twitterID").html('<input id="twitterID" type="text">');
    $(".twitterpasswd").html('<input id="twitterpasswd" type="text">');
    $(".setbutton").html('<input id="save" type="button" value="登録">');
  }
  //登録ボタンが押されたとき
  $("#save").click(function(){
    localStorage["twitterID"] = $("#twitterID").val();
    localStorage["twitterpasswd"] = $("#twitterpasswd").val();
    localStorage["fuki"] = $("#fuki").val();
	   $.ajax({
       type:'POST',
       scriptCharset:'utf-8',
       url:'http://ikakun.net/~kakimoto/TweetTest/tweettest.php',
       data:
  			{twitterID: $("#twitterID").val(), twitterpasswd: $("#twitterpasswd").val()},
        success:
          function(data){
            localStorage["followees"] = data;
          }
      });
  });
  //解除ボタンが押されたとき
  $("#clear").click(function(){
    localStorage.clear();
  });
});

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
