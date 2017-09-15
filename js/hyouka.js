/*****ページを更新したタイミング*****/
//URLをbackgroundに送信
chrome.runtime.sendMessage(
	{type: "timelog",name:"pagestart",URL:URL},
	function (response){}
);

/*****ページを閉じた，または遷移したタイミング*****/
//URLをbackgroundに送信
window.addEventListener("beforeunload", function() {
	var URL = location.href;
	chrome.runtime.sendMessage(
	{type: "timelog",name:"pageend",URL:URL},
	function (response){}
	);
}, false);
