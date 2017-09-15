function fukidashi(){
	//ハイライト部分の上にカーソルが乗った
	$('.rumorhighlight').on(
		"mouseenter", 
		function () {
			var icon1 = chrome.extension.getURL('img/rumorinfo.jpg');
			var icon2 = chrome.extension.getURL('img/teiseiinfo.jpg');
			var img1 = '<img src="' + icon1 +'" width="550" height="50">';
			var img2 = '<img src="' + icon2 +'" width="550" height="120">';
			var rumortext = $(this).attr("data-rumortext");
			var num = $(this).attr("data-rumornum");
			var tnum = $(this).attr("data-teiseinum");
			var correction = $(this).attr("data-correction");
			var syousailink = "http://mednlp.jp/~miyabe/rumorCloud/detail_dema.cgi?m=all&r="+num+"&n="+tnum+">"
			syousai(num,tnum);
			$(this).showBalloon({
				contents:
				'<div class ="fukidashicontents">'
				+	'<div class ="rumorinformationtext">'
				+		img1 
				+		'<div class ="rumortext">'
				+ 			rumortext
				+ 		'</div>' 
				+	'</div>'
				
				+'<div class ="rumorinformationteisei">'
				+		img2
				+		'<div class ="rumorteisei">'
				+ 			correction
				+			'<a class = "rumorcloud" href='+syousailink+' 詳細</a>'
				+		'</div>'
				+	'</div>'
				+'</div>'
				,
				
				position: 'top right'
			});
			var timeflag = 0;
			chrome.runtime.sendMessage(
				{type: "timelog",name:"highlighton",URL:URL,rumortext:rumortext},
				function (response){}
			);
			
			//吹き出し上にカーソルがある
			$('.fukidashicontents').on(
				"mouseenter", 
				function(){
					fukidashiover = 1;
					chrome.runtime.sendMessage(
					{type: "timelog",name:"fukidashion",URL:URL,rumortext:rumortext},
					function (response){}
					);
				}
			);
			//吹き出し上からカーソルが外れた
			$('.fukidashicontents').on(
				"mouseleave", 
				function(){
					flag = 2;
					$('.rumorhighlight').hideBalloon();
					fukidashiover = 0;
					timeflag = 1;
					chrome.runtime.sendMessage(
					{type: "timelog",name:"fukidashiout",URL:URL,rumortext:rumortext},
					function (response){}
					);
				}
			);
			//ハイライト部分からカーソルが外れた
			$('.rumorhighlight').on(
				"mouseleave", 
				function(){
					setTimeout(
						function(){
							if(fukidashiover == 0 && timeflag == 0){
								$('.rumorhighlight').hideBalloon();
								chrome.runtime.sendMessage(
								{type: "timelog",name:"highlightout",URL:URL,rumortext:rumortext},
								function (response){}
								);
								timeflag = 1;
							}
						}
					,300
					)
				}
			);
		}
	);
}