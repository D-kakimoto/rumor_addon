//status_getの取得命令
function status_post(rumortext){
	chrome.runtime.sendMessage(
		{type: "status_get",text:rumortext},
		function (response){
		}
	);
}

//status_update
function status_update(rumortext,value){
	//console.log(rumortext+":"+value);
	chrome.runtime.sendMessage(
		{type: "status_update",text:rumortext,value:value},
		function (response){
			chrome.storage.local.set(
				{[rumortext]: "checked"},
				function (){}
			);
		}
	);
}

//backgroundからstatusを取得
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "status_send"){
			if(request.data != "none"){
				var data = request.data;
				var posneg = data.split('/');
				$('.rumorstatus>.rumor_positive').text(posneg[0]);
				$('.rumorstatus>.rumor_negative').text(posneg[1]);
			}else{
				$('.rumorstatus>.rumor_positive').text('0');
				$('.rumorstatus>.rumor_negative').text('0');
			}
		}
  }
);
