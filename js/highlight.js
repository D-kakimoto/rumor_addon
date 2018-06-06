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

//search関数(レーベンシュタイン距離)
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
  /*
  var checked;
  var findtext = new Array();
  var findrumor = new Array();
  var text = text.split("\n");//改行で区切る
  for(var k = 0;k<text.length;k++){
    var judgetext = removeTag(text[k],"a");
    for(var i =0;i<words.length-1;i++){
      var rumor = words[i].split("\t");
      var distance = levenshteinDistance(judgetext,rumor[4]);
      if(distance == 0){
        findrumor.push(rumor[4]);
        findtext.push(judgetext);
        $("body").highlight(judgetext,rumor[4],rumor[0],rumor[3],rumor[5],0);
        $('<div id='+rumor[0]+' class="tooltip-component basic-tooltip">'+rumor[4]+'<br><br>'+rumor[5]+'</div>').appendTo('body');
        checked++;
      }
    }
  }
  if(findtext.length != 0){
    var toast_string = "";
    findrumor = findrumor.filter(function (x, i, self) {
            return self.indexOf(x) === i;
    });
    for(var i=0; i<findrumor.length; i++){
      toast_string += "・"+findrumor[i];
    }
    toast_on(i,toast_string);
  }
  //console.log("流言検出："+findtext.length+"箇所");
  chrome.runtime.sendMessage(
    {type: "rumorchecked",count:findtext.length},
    function(res){}
  );
  */
}

//レーベンシュタイン距離
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

  //トースト通知を生成
  if(findtext.length != 0){
    var toast_string = "";
    findrumor = findrumor.filter(function (x, i, self) {
            return self.indexOf(x) === i;
    });
    for(var i=0; i<findrumor.length; i++){
      toast_string += "・"+findrumor[i]+"<br>";
    }
    if(op_tst != "off"){
      toast_on(i,toast_string);
    }
  }

	//console.log("流言検出："+findtext.length+"箇所");
  chrome.runtime.sendMessage(
    {type: "rumorchecked",count:findtext.length},
    function(res){}
  );
};

//search関数
function search_custom3(text,rumorlist) {
  //textを改行コード単位で分割
	var text_lines = text.split("\n");
  var rumors = rumorlist.split("\n\n");
  //console.log(rumors);
  //マッチ判別処理
	for(var k=0;k<text_lines.length;k++){
		var text_line = removeTag(text_lines[k]);
    for(var i=0;i<rumors.length-1;i++){
      var match_flag = 0;
      var rumorinfo = rumors[i].split('\t');
      var rumortext = rumorinfo[4];
      var correction = rumorinfo[5];
      var correction_cnt = rumorinfo[3];
      var rumornum = rumorinfo[0];
      var search_query = rumorinfo[1];
      var mps = search_query.split('/');
      for(var l=0;l<mps.length;l++){
        var RegularExp = new RegExp(mps[l],"g");
        var res = text_line.match(RegularExp);
        //形態素が全て含まれていればマッチ(順不同)
        if(!res || mps == ""){break;}
        else{if(l+1==mps.length){match_flag = 1;}}
      }
      if(match_flag==1){
        //console.log("マッチしました");
        //console.log(text_line);
        //console.log(rumortext);
        var replaced_line =
        '<rumorinfo '+
        'class="rumorhighlight" data-teiseinum="'+
        correction_cnt+
        '"data-rumortext="'+
        rumortext+
        '"data-correction="'+
        correction+
        '"data-rumornum="'+
        rumornum+
        '"data-query="'+
        search_query+
        '">'+
        text_lines[k]+
        '</rumorinfo>';
        text_lines[k] = replaced_line;
      }
    }
  }
  var replaced_html = "";
  for(var i=0;i<text_lines.length;i++){
    replaced_html += text_lines[i];
    replaced_html += "\n";
  }
  //$('body').html(replaced_html);

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
}





function search(text,rumorlist){
  var rumors = rumorlist.split("\n\n");
  for(var i=0;i<rumors.length-1;i++){
    node_search("body",rumors[i]);
  }
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
}

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
