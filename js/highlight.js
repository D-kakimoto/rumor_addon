//htmlタグの除去
function removeTag(str, arrowTag) {
    // 配列形式の場合は'|'で結合
    if ((Array.isArray ?
        Array.isArray(arrowTag)
        : Object.prototype.toString.call(arrowTag) === '[object Array]')
    ) {
        arrowTag = arrowTag.join('|');
    }
    // arrowTag が空の場合は全てのHTMLタグを除去する
    arrowTag = arrowTag ? arrowTag : '';
    // パターンを動的に生成
    var pattern = new RegExp('(?!<\\/?(' + arrowTag + ')(>|\\s[^>]*>))<("[^"]*"|\\\'[^\\\']*\\\'|[^\\\'">])*>', 'gim');
    return str.replace(pattern,'');
}

//レーベンシュタイン距離を使ったマッチング
function search_custom(text,words){
  var rumors = [];
  var texts = text.split('\n');
  for(var i=0;i<words.length-1;i++){
      var rumorinfo = words[i].split('\t');
      rumors.push(rumorinfo[4]);
  }
  for(var i=0;i<texts.length;i++){
    var text_notag = removeTag(texts[i]);
      //console.log(i+":"+text_notag);
    for(var j=0;j<rumors.length;j++){
      var rumortext = rumors[j];
      var result = levenshteinDistance(text_notag,rumortext);
      if(result<0.7){
        console.log(text_notag);
        console.log(rumortext);
        console.log("距離："+result);
      }
    }
  }
}

//レーベンシュタイン距離測定アルゴリズム
function levenshteinDistance(str1,str2){
    var x = str1.length;
    var y = str2.length;
    var d=[];
    for(var i=0; i<=x; i++){
        d[i] = [];
        d[i][0] = i;
    }
    for(var i=0; i<=y; i++){
        d[0][i] = i;
    }
    var cost = 0;
    for(var i=1; i<=x; i++){
        for(var j=1; j<=y; j++){
            cost = str1[i-1] == str2[j-1] ? 0:1;
            d[i][j] = Math.min(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + cost);
        }
    }
    if(x>=y){
      return d[x][y]/x;
    }else{
      return d[x][y]/y;
    }
}

//search関数
function search_custom2(text,words) {
	var checked;
	var findtext = new Array();
  var findrumor = new Array();
	var text = text.split("\n");//改行で区切る
	for(var k = 0;k<text.length;k++){
		var judgetext = removeTag(text[k],"a");
		for(var i =0;i<words.length-1;i++){
			var yuusendo = 0;
			var rumor = words[i].split("\t");
			var keitaiso = rumor[1].split("/");
			keitaiso.pop();
			for(var m=0;m<keitaiso.length;m++){
				var findflag = 0;
				var RegularExp = new RegExp(keitaiso[m],"g");
				var res = judgetext.match(RegularExp);
				if(!res){break;}//texts[k]にword[i]の形態素が存在しなかった時点でbreak
				//拡散防止優先度
				if(m == keitaiso.length-1){
					for(var h=0;h<findtext.length;h++){
						if(findtext[h] == judgetext){
							findflag = 1;
							break;
						}
					}
					if(findflag == 1){break;}
					else{
            findrumor.push(rumor[4]);
						findtext.push(judgetext);
						//console.log("判定箇所："+k+"番目の"+texts[k]);
						//if(texts[k-6] && texts[k-10].match(/kakimoto/)){
						//	yuusendo = 1;
						//	console.log("優先度設定");
						//}else{
						//	console.log("優先度なし");
						//}
						$("html").highlight(judgetext,rumor[4],rumor[0],rumor[3],rumor[5],yuusendo,rumor[1]);
						checked++;
            $('<div id='+rumor[0]+' class="tooltip-component basic-tooltip">'+rumor[4]+'<br><br>'+rumor[5]+'</div>').appendTo('html');
					}
				}
			}
		}
	}
};

//search関数を通す
function search(text,rumorlist){
  var rumors = rumorlist.split("\n\n");
  var finded_rumors = [];
  var count = 0;
  for(var i=0;i<rumors.length-1;i++){
    var result = node_search("body",rumors[i]);
    if(result == 1){
      var rumorinfo = rumors[i].split("\t");
      finded_rumors.push(rumorinfo[4]);
      count++;
    }
  }
  //ハイライトカラーの設定
  window.setTimeout(initColorset,30);
  function initColorset(){
    if(op_color){
      if(op_hl == "off"){
        $(".rumorhighlight").css("backgroundColor", "null");
      }else{
        $(".rumorhighlight").css("backgroundColor", op_color);
      }
    }else{
      initColorset();
    }
  }
  //出現流言の数をカウント→(トースト&バッジ)
  if(count >= 1 && op_tst != "off"){
    var str = "";
    var rumors = finded_rumors.filter(
      function (x, i, self){
        return self.indexOf(x) === i;
      }
    );
    for(var i=0; i<rumors.length; i++){
      if(i<5){
        str += "・"+rumors[i]+"<br>";
      }else if(i==5){
        str += "...など";
      }
    }
    toast_on(i,str);
    badge(i);
  }
  //バッジ生成のためのバックグラウンド送信
  function badge(i){
    chrome.runtime.sendMessage(
      {type: "count_rumor",count:i},
      function(res){}
    );
  }
}

//木構造でなぞりながら見ていく
function node_search(tag,rumorline){
  var node = $(tag).children();
  var rumorinfo = rumorline.split('\t');
  var rumortext = rumorinfo[4];
  var correction = rumorinfo[5];
  var correction_cnt = rumorinfo[3];
  var rumornum = rumorinfo[0];
  var search_query = rumorinfo[1];
  var rumor_mps = search_query.split('/');

  if(node.length==0){
    return 0;
  }
  var flag = 0;
  for(var i=0;i<node.length;i++){
    text = node.eq(i).text();
    for(var l=0;l<rumor_mps.length-1;l++){
      var RegularExp = new RegExp(rumor_mps[l],"g");
      var res = text.match(RegularExp);
      if(!res){break;}
    }
    if(res){
      flag++;
      $(node.eq(i)).addClass("rumorhighlight");
      $(node.eq(i)).attr('data-rumortext', rumortext);
      $(node.eq(i)).attr('data-rumornum', rumornum);
      $(node.eq(i)).attr('data-teiseinum', correction_cnt);
      $(node.eq(i)).attr('data-correction', correction);
      $(node.eq(i)).attr('data-query', search_query);
      var result = node_search(node.eq(i),rumorline);
      if(result == 1){
        $(node.eq(i)).removeClass("rumorhighlight");
      }
    }
  }
  if(flag == 0){
    return 0;
  }else{
    return 1;
  }
}


//トーストの生成
function toast_on(count,string){
  $(document).ready(function() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    Command:toastr["success"](string, count+"件の流言を検出")
    $('#linkButton').click(function() {
      toastr.success('click');
    });
  });
}
