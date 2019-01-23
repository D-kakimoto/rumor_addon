var only_fuki_flag = 0;

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

//吹き出しの表示/非表示
var fuki_on_flag = 0;

//吹き出し関数
function fukidashi(){
	if(op_fuki == "off")return;
	//ハイライト部分の上にカーソルが乗った
	$('.rumorhighlight').on(
		"mouseenter",
		function () {
			if(fuki_on_flag == 2){
				fuki_on_flag = 1;
				return;
			}
			if(fuki_on_flag == 3){
				fuki_on_flag = 1;
				return;
			}
			fuki_on_flag = 1;
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
			var icon3 = chrome.extension.getURL('../img/status_good.png');
			var icon4 = chrome.extension.getURL('../img/status_bad.png');
			var img1 = '<img class="icon1" src="' + icon1 + '">';
			var img2 = '<img class="icon2" src="' + icon2 + '">';
			var img3 = '<img class="icon3" src="' + icon3 + '">';
			var img4 = '<img class="icon4" src="' + icon4 + '">';
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
				+	'<div class="status_parent">'
				+		'<div class ="rumorstatus">'
				+     '<div class="status_area_icon" id="rumor_pos_select">'
				+     img3
				+     '</div>'
				+			'<div class="rumor_positive"></div>'
				+     '<div class="status_area_icon" id="rumor_neg_select">'
				+     img4
				+     '</div>'
				+			'<div class="rumor_negative"></div>'
				+ 	'</div>'
				+		'<div class ="checked_rumor">'
				+     '情報を確認したので今後は通知しない'
				+ 	'</div>'
				+	'</div>'

				+'</div>'
				,
				position: fuki_position,
				offsetX: fuki_over_x,
				offsetY: fuki_over_y,
			});
			$(this).removeClass('blink-highlight');
			eval_post("hl_on",URL,rumortext);
			console.log("hl_on");
			//吹き出し上にカーソルがある
			$('.fukidashicontents').on(
				"mouseenter",
				function(){
					console.log(fuki_on_flag);
					if(fuki_on_flag == 1 || fuki_on_flag == 2 || only_fuki_flag == 1){
						fuki_on_flag = 1;
						console.log("表示2");
						return;
					}
					fuki_on_flag = 1;
					only_fuki_flag = 1;
					console.log("表示");
					eval_post("fuki_on",URL,rumortext);
					status_post(rumortext);
					//goodが押された
					$('#rumor_pos_select').on(
						"click",
						function(){
							status_update(rumortext,"good");
							var poscount = $('.rumorstatus>.rumor_positive').text();
							poscount++;
							$('.rumorstatus>.rumor_positive').text(poscount);
						}
					);
					//badが押された
					$('#rumor_neg_select').on(
						"click",
						function(){
							status_update(rumortext,"bad");
							var negcount = $('.rumorstatus>.rumor_negative').text();
							negcount++;
							$('.rumorstatus>.rumor_negative').text(negcount);
						}
					);
					console.log("fuki_on");
					//web検索が押された
					$('a.web_search').on(
						"click",
						function(){
							eval_post("search",URL,rumortext);
							console.log("search");
						}
					);
					//詳細リンクが押された
					$('a.rumorcloud').on(
						"click",
						function(){
							eval_post("dlink",URL,rumortext);
							console.log("dlink");
						}
					);
				}
			);
			//吹き出し上からカーソルが外れた
			$('.fukidashicontents').on(
				"mouseleave",
				function(){
					fuki_on_flag = 2;
					setTimeout(
						function(){
							if(fuki_on_flag == 2){
								$('.rumorhighlight').hideBalloon();
								eval_post("fuki_out",URL,rumortext);
								console.log("fuki_out");
								fuki_on_flag = 0;
								only_fuki_flag = 0;
							}
						},1500
					)
				}
			);
		}
	);
	//ハイライト部分からカーソルが外れた
	$('.rumorhighlight').on(
		"mouseleave",
		function(){
			fuki_on_flag = 3;
			var rumortext = $(this).data('rumortext');
			setTimeout(
				function(){
					if(fuki_on_flag == 3){
						$('.rumorhighlight').hideBalloon();
						eval_post("hl_out",URL,rumortext);
						console.log("hl_out");
						fuki_on_flag = 0;
					}
				},1500
			)
		}
	);
}
