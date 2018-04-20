//詳細の取得
function syousai(num,tnum){
	chrome.runtime.sendMessage(
		{type: "syousaisend", text:num, text2:tnum}
	);
}

//Google検索クエリの生成
function query_build(queries){
	var query = queries.split("/");
	var url = "https://www.google.co.jp/search?q=";
	for(var i=0;i<query.length;i++){
		var url = url + "+" + query[i];
	}
	return url;
}

//吹き出し関数
function fukidashi(){
	//ハイライト部分の上にカーソルが乗った
	$('.rumorhighlight').on(
		"mouseenter",
		function () {
			//ウインドウサイズの取得
			var window_width = $(window).width();
			var window_height = $(window).height();
			//ハイライト箇所の位置情報
			var mark_pos = $(this).offset();
			var mark_width = $(this).width();
			var mark_height = $(this).height();
			//ハイライト箇所の要素のウインドウ内位置(四隅)
			var mark_pos_left = mark_pos.left - $(window).scrollLeft();
			var mark_pos_top =  mark_pos.top - $(window).scrollTop();
			var mark_pos_right = mark_pos_left + mark_width;
			var mark_pos_bottom = mark_pos_top + mark_height;
			//吹き出しのウインドウ内位置(四隅)
			var fuki_pos_left = mark_pos_right;
			var fuki_pos_right = fuki_pos_left + 315;
			var fuki_pos_top = mark_pos_bottom;
			var fuki_pos_bottom = fuki_pos_top + 300;

			//はみ出し他時用の補正変数
			var fuki_over_x = 0;
			var fuki_over_y = 0;
			var fuki_position = "bottom right";


			//下側で吹き出しがはみ出した場合の処理
			if(fuki_pos_bottom > window_height){
				var bottom_over = fuki_pos_bottom - window_height;
				var fuki_position = "top right";
				//console.log("下側はみ出し分" + bottom_over);
			}
			//右側で吹き出しがはみ出した時の処理
			if(fuki_pos_right > window_width){
				var right_over = fuki_pos_right - window_width;
				var fuki_over_x = -(right_over + 20);
				if(fuki_position == "bottom right"){
					fuki_over_y = -3;
				}else{
					fuki_over_y = 3;
				}
				//console.log("右側はみ出し分:" + fuki_over_x);
			}

			var icon1 = chrome.extension.getURL('../img/image_test.png');
			var icon2 = chrome.extension.getURL('../img/image_test.png');
			var img1 = '<img class="icon1" src="' + icon1 + '" width="20" height="20">';
			var img2 = '<img class="icon2" src="' + icon2 + '" width="20" height="20">';
			var rumortext = $(this).attr("data-rumortext");
			var num = $(this).attr("data-rumornum");
			var tnum = $(this).attr("data-teiseinum");
			var correction = $(this).attr("data-correction");
			var search_query = $(this).attr("data-query");
			var web_search_link = query_build(search_query);
			var syousailink = "http://mednlp.jp/~miyabe/rumorCloud/detail_dema.cgi?m=&r="+num+"&n="+tnum+">";
			syousai(num,tnum);

			//吹き出し表示
			$(this).showBalloon({
				contents:
				'<div id="fukidashicontents_id" class ="fukidashicontents dropmenu">'
				+	'<div class ="rumor_parent">'
				+		img1
				+		'<div class ="rumortext">'
				+			rumortext
				+ 	'</div>'
				+	'</div>'
				+	'<div class="teisei_parent">'
				+		img2
				+		'<div class ="rumorteisei">'
				+ 		correction
				+		'</div>'
				+	'</div>'
				+	'<div class="detail_parent">'
				+		'<div class ="teisei_count">'
				+ 		'訂正数'
				+ 		tnum
				+		'</div>'
				+		'<div class ="web_search">'
				+ 		'web検索'
				+			'<a class="web_search" href="'+web_search_link+'" target="_blank" >'+'▼</a>'
				+		'</div>'
				+		'<div class ="detail_link">'
				+ 		'詳細リンク'
				+			'<a class="rumorcloud" href="'+syousailink+'" target="_blank" >'+'▼</a>'
				+		'</div>'
				+	'</div>'
				+'</div>'
				,
				position: fuki_position,
				offsetX: fuki_over_x,
				offsetY: fuki_over_y,
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
					,500
					)
				}
			);
		}
	);
}

//吹き出しサイズを動的に変更(テスト版)
function fukidashi_custom(){
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

  //ツールチップ対象をマウスアウト時
  	function() {
    	var tooltip_id = '#' + $(this).attr('data-rumornum');
    	// ツールチップ非表示
    	$(tooltip_id).removeClass('tooltip-show');
    	// ツールチップの元の幅に戻す
    	$(tooltip_id).outerWidth(origTooltipWidth);
  	}
	);
}
