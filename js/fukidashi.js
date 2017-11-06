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
			var syousailink = "http://mednlp.jp/~miyabe/rumorCloud/detail_dema.cgi?m=&r="+num+"&n="+tnum+">"
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

				position: 'null'
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

function fukidashi_old(){
	var windowWidth;
	var windowHeight;
	var origTooltipWidth;
	// ロード時、リサイズ時にウィンドウサイズ取得
	$(window).on('load resize', function(){
    windowWidth = $(window).width();
    windowHeight = $(window).height();
	});
	$('.rumorhighlight').hover(
  // ツールチップ対象をマウスオーバー時
  	function() {
    	var scrollX = $(window).scrollLeft();
    	var scrollY = $(window).scrollTop();
    	var fontSize = 20;
    	var offset = $(this).offset();
    	var tooltip_id = '#' + $(this).attr('data-rumornum');
    	var tooltipLeft = offset.left;
    	var tooltipTop = offset.top + fontSize + 5;
    	var tooltipWidth = $(tooltip_id).outerWidth();
    	var tooltipHeight = $(tooltip_id).outerHeight();
    	// マウスアウト時に戻すため、ツールチップの元の幅を保持
    	origTooltipWidth = tooltipWidth;
    	// ウィンドウ幅よりツールチップの幅が大きい場合
    	if(windowWidth < tooltipWidth) {
      	// ツールチップの幅を狭めて中央に表示
      	tooltipWidth = windowWidth * 0.7;
      	tooltipLeft = windowWidth * 0.15;
      	// ツールチップの幅を設定
      	$(tooltip_id).outerWidth(tooltipWidth);
      	// ツールチップの幅が変われば高さも変わるので高さを再取得
      	tooltipHeight = $(tooltip_id).outerHeight();
    	}
    	// ツールチップがウィンドウからはみ出る場合
    	if(0 < ((tooltipWidth + tooltipLeft) - (windowWidth + scrollX))) {
      	// ツールチップの位置をはみ出る分だけ左にずらす
      	tooltipLeft = tooltipLeft - ((tooltipWidth + tooltipLeft) - (windowWidth + scrollX)) - 20;
    	}
    	// ツールチップが画面の下にはみ出る場合
    	if(0 < ((tooltipHeight + tooltipTop) - (windowHeight + scrollY))) {
      	// ツールチップの位置をテキストリンクの上に表示する
      	tooltipTop = offset.top - tooltipHeight - 5;
    	}
    	// ツールチップの位置を設定
    	$(tooltip_id).css("top", tooltipTop);
    	$(tooltip_id).css("left", tooltipLeft);
    	// ツールチップ表示
    	$(tooltip_id).addClass('tooltip-show');
			console.log("表示");
  	},

  // ツールチップ対象をマウスアウト時
  function() {
    var tooltip_id = '#' + $(this).attr('data-rumornum');
    // ツールチップ非表示
    $(tooltip_id).removeClass('tooltip-show');
    // ツールチップの元の幅に戻す
    $(tooltip_id).outerWidth(origTooltipWidth);
  }
);
