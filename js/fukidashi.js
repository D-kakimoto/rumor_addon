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
	if(op_fuki == "off")return;
	var fuki_on_flag = 0;
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

			var icon1 = chrome.extension.getURL('../img/rumortext_icon.png');
			var icon2 = chrome.extension.getURL('../img/rumorteisei_icon.png');
			var img1 = '<img class="icon1" src="' + icon1 + '">';
			var img2 = '<img class="icon2" src="' + icon2 + '">';
			var rumortext = $(this).attr("data-rumortext");
			var num = $(this).attr("data-rumornum");
			var tnum = $(this).attr("data-teiseinum");
			var correction = $(this).attr("data-correction");
			var search_query = $(this).attr("data-query");
			var web_search_link = query_build(search_query);
			var syousailink = "http://mednlp.jp/~miyabe/rumorCloud/detail_dema2.cgi?m=&r="+num+"&n="+tnum;
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
				+			'<a class="web_search" href="'+web_search_link+'" target="_blank" >'+'Web検索▼</a>'
				+		'</div>'
				+		'<div class ="detail_link">'
				+			'<a class="rumorcloud" href="'+syousailink+'" target="_blank" >'+'詳細リンク▼</a>'
				+		'</div>'
				+	'</div>'
				+'</div>'
				,
				position: fuki_position,
				offsetX: fuki_over_x,
				offsetY: fuki_over_y,
			});
			$(this).removeClass('blink-highlight');
			eval_post("hl_on",URL,rumortext);

			//吹き出し上にカーソルがある
			$('.fukidashicontents').on(
				"mouseenter",
				function(){
					fuki_on_flag = 1;
					eval_post("fuki_on",URL,rumortext);
				}
			);
			//吹き出し上からカーソルが外れた
			$('.fukidashicontents').on(
				"mouseleave",
				function(){
					setTimeout(
						function(){
							$('.rumorhighlight').hideBalloon();
							eval_post("fuki_out",URL,rumortext);
							fuki_on_flag = 0;
						},1000
					)
				}
			);
		}
	);
	//ハイライト部分からカーソルが外れた
	$('.rumorhighlight').on(
		"mouseleave",
		function(){
			var rumortext = $(this).data('rumortext');
			setTimeout(
				function(){
					if(fuki_on_flag == 0){
						$('.rumorhighlight').hideBalloon();
						eval_post("hl_out",URL,rumortext);
					}
				},1000
			)
		}
	);
}
