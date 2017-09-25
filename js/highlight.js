//タグ全削除
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
						$("body").highlight(judgetext,rumor[4],rumor[0],rumor[3],rumor[5],yuusendo);
						checked++;
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
      toast_string += i+1+"："+findrumor[i];
    }
    toast_on(i,toast_string);
  }
	//console.log("流言検出："+findtext.length+"箇所");
  chrome.runtime.sendMessage(
    {type: "rumorchecked",count:findtext.length},
    function(res){}
  );
};

//ページ読み込み時流言検出数をトーストで表示
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
