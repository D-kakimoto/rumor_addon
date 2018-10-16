/*****変数定義*****/
var rumorlist;//グローバル変数に流言リストを格納．
var array = new Array();
var flag = 0;//0=更新受付中，1=画面書き換え中，2=画面書き換え直後．
var tyouhuku = 0;
var followee = new Array();
var twitterID;
var twitterpasswd;
var fukidashiover = 0;
var rumorchecklist;
var op_hl = "defaults";
var op_tst = "defaults";
var op_fuki = "defaults";
var op_color = "yellow";
var op_eval = "defaults"
/******************/

//オプション(ユーザ設定)情報の取得
chrome.storage.local.get(
	["hlop", "tstop", "fukiop","colorop","evalop"],
	function(value){
		if(value.hlop){
			op_hl = value.hlop;
			op_tst = value.tstop;
			op_fuki = value.fukiop;
			op_color = value.colorop;
			op_eval = value.evalop;
		}
});

/*****ページ更新時処理******/
//アイコンセット命令
chrome.runtime.sendMessage(
	{type: "set_icon"},
	function (response){
	}
);

//取得命令のみ(レスポンスなし)
chrome.runtime.sendMessage(
	{type: "rumorget"},
	function (response){
		//console.log("1.background.jsに流言取得命令を送信完了");
	}
);

//30msごとにrumorlistが取得できたかチェック
window.setTimeout(initGetRumor,30);
function initGetRumor(){
	//rumorlistの取得
	chrome.runtime.sendMessage(
		{type: "rumorsend"},
		function(res){
			rumorlist = res;
			//console.log(rumorlist);
		}
	);
	//rumorlistがある場合ハイライト処理
	if(rumorlist != undefined)  {
		var lines = rumorlist.split("\n\n");
		var len = lines.length;//lenは配列の個数
		for(var n = 0; n < len; n++){
			array.push(lines[n]);
		}
		var text = $('body').html();
		/*for(var m=0; m<followee.length-1;m++){
			console.log(followee[m]);
		}*/
		//timer1はハイライト処理にかかる時間を計測している
		//console.time('timer1');
			$.when(
				search(text,rumorlist)
			).done(function(){
   			fukidashi();
			});
		//console.timeEnd('timer1');
	//rumorlistが無い場合，もう一度確かめる
	}else{
		window.setTimeout(initGetRumor,30);
	}
}

//ポップアップ内流言検出リストがクリックされたらハイライト箇所まで飛ぶ
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
		if(message.type == "pop_click_same"){
			var elem_parent = $("[data-rumortext='"+message.rumor+"']");
			var old_elem = elem_parent.eq(message.count-1);
			old_elem.removeClass('blink-highlight');
			if(message.count < elem_parent.length){
				var elem = elem_parent.eq(message.count);
				$("html,body").animate({scrollTop:elem.offset().top});
				elem.addClass('blink-highlight');
				sendResponse("continue");
			}else{
				var elem = elem_parent.eq(0);
				$("html,body").animate({scrollTop:elem.offset().top});
				elem.addClass('blink-highlight');
				sendResponse("break");
			}
		}else if(message.type == "pop_click_diff"){
			var old_rumor = message.old_rumor;
			var old_elem_parent = $("[data-rumortext='"+old_rumor+"']");
			old_elem_parent.removeClass('blink-highlight');
			var elem_parent = $("[data-rumortext='"+message.rumor+"']");
			var elem = elem_parent.eq(0);
			$("html,body").animate({scrollTop:elem.offset().top});
			elem.addClass('blink-highlight');
		}else{
			console.log("閉じます");
		}
});
