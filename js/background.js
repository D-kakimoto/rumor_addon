//必要情報
var rumorlist;
var rumorid;
var teiseinum;
//評価用
var URL;
//情報取得用サーバ
var server = "http://www2.yoslab.net/~kakimoto/rumor_background/";

/******contentscriptからの受け取り用******/
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if(request.type == "rumorget"){
			//console.log("2.myscript.jsから命令(rumorget)を受け取った");
			rumorlist = rumorget(request.type);
		}if(request.type == "rumorsend"){
			//console.log("5.myscript.jsから命令(rumorsend)を受け取った");
			sendResponse(rumorlist);
			//console.log("6.myscript.jsに対しrumorlistに格納されているテキストを送信");
		}if(request.type == "syousaisend"){//右クリック時のためのもの
			rumorid = request.text;
			teiseinum = request.text2;
		}if(request.type == "log"){
			//idを取得
			var user_id = chrome.runtime.id;
			console.log(user_id);
			//現在時刻を取得
			var time = (new Date()).getTime();
			//URLを取得
			var URL = request.URL;
			//操作タイプを取得
			var type = request.name;
			//テキストを取得
			var text = request.text;
			//console.log("時間："+time+",タイプ:"+type+",URL："+URL+"テキスト："+text+"\n");
			//サーバへ情報を送信
			$.ajax({
					type:
						'POST',
					scriptCharset:
					'utf-8',
					url:
						server+'addon_eval/dbconnect.php',
					data:
						{id:id,time:time,URL:URL,type:type,text:text},
					success:
						function(data){
							console.log(data);
						}
			});
		}
	}
);
/****************************************/

function rumorget(name){
	//console.log('3.流言情報取得を開始');
		$.ajax({
		scriptCharset:
			"utf-8",
		url:
			server+'get_rumors/rumors.txt',
		success:
			function(result){
				rumorlist = result;
				//console.log(rumorlist);
			}
	});
};

//オプション情報取得待ちうけとcontentscriptへの送信
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getLocalStorage")
      sendResponse(
				{
					twitterID: localStorage["twitterID"],
					twitterpasswd: localStorage["twitterpasswd"],
					followees: localStorage["followees"],
					fuki: localStorage["fuki"]
				}
			);
    else
      sendResponse({});
});

//highlight.jsから受け取った検出流言数の情報を受け取り，バッジとして表示する
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if(request.type == "rumorchecked"){
			var rumorcount = request.count;
			if(rumorcount == "0")chrome.browserAction.setBadgeText({text:""});
			else chrome.browserAction.setBadgeText({text:String(rumorcount)});
		}
	}
);

/*
//右クリック時の処理
chrome.contextMenus.create({
	id:"rumorsyousai",
    title: "流言情報の詳細を見る"
});
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == "rumorsyousai") {
    	chrome.tabs.create({url: 'http://mednlp.jp/~miyabe/rumorCloud/detail_dema.cgi?m=all&r=' + rumorid + '&n='+ teiseinum});
    }
});
*/
