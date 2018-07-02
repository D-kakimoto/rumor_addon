//必要情報
var rumorlist;
var rumorid;
var teiseinum;
var userid;

//評価用
var URL;
//情報取得用サーバ
var server = "http://www2.yoslab.net/~kakimoto/rumor_background/";

//(初回起動時)ランダムトークンを生成
function getRandomToken() {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
}

//ユーザIDの取得
chrome.storage.sync.get('userid', function(items){
	userid = items.userid;
	if(!userid){
		userid = getRandomToken();
		chrome.storage.sync.set({userid: userid}, function(){});
	}
	//console.log(userid);
});

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
		}if(request.type == "log" || request.type == "report"){
      console.log("mongoにアクセス");
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
						{userid:userid,time:time,URL:URL,type:type,text:text},
					success:
						function(data){
							//console.log(data);
						}
			});
		}if(request.type == "count_rumor"){
      var count = request.count;
      var datalist = {
        count: count,
      };
      if(request.list){
        var list = request.list;
        for(var i=0;i<list.length;i++){
          datalist[i] = list[i];
        }
      }
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        localStorage.setItem(tabs[0].url, JSON.stringify(datalist));
      });
    	if(count != "0"){
        chrome.browserAction.setBadgeText({text:String(count)});
      }else{
        chrome.browserAction.setBadgeText({text:String("")});
      }
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

// タブが切り替わった時にバッジを更新
chrome.tabs.onActivated.addListener(function (tabId) {
  chrome.tabs.query({"active": true}, function (tab) {
    var count;
    var data = JSON.parse(localStorage.getItem(tab[0].url));
    if(data){
      if(data.count != "0"){
        chrome.browserAction.setBadgeText({text:String(data.count)});
      }else{
        chrome.browserAction.setBadgeText({text:String("")});
      }
    }else{
      chrome.browserAction.setBadgeText({text:String("")});
    }
  });
});
