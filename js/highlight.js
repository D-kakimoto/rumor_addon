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
}

//レーベンシュタイン距離
function levenshteinDistance(str1,str2){
    var x=str1.length;
    var y=str2.length;
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
    return d[x][y];
}

//search関数
function search(text,words) {
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
