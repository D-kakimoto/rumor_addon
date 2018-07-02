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
  //出現流言の数をカウント→トースト用
  if(count >= 1){
    var str = "";
    var list_str = [];
    var excount = 0;
    var break_flag = 0;
    var rumors = finded_rumors.filter(
      function (x, i, self){
        return self.indexOf(x) === i;
      }
    );
    for(var i=0; i<rumors.length; i++){
      //検出されたがハイライトされていないものは類似流言としてカウント．(ハイライトの重複削除)
      var elem = $("[data-rumortext='"+rumors[i]+"']");
      if(elem.length>0){
        excount++;
        list_str.push(rumors[i]);
        if(excount<5){
          str += "・"+rumors[i]+"<br>";
        }else if(excount==5){
          str += "...など";
        }
      }else{
        break_flag = 1;
        break;
      }
    }
    if(count>=1 && op_tst != "off" && break_flag==0){
      toast_on(excount,str);
    }
    badge(excount,list_str);
  }else{
    badge(0);
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
  if(rumor_mps.length <= 2){
    return 0;
  }
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
      var LDres = levenshteinDistance(text,rumortext);
      var exs_check = $(node).attr("data-rumortext");
      var node_height = $(node).innerHeight();
      if(!exs_check){
        if(LDres <= 0.92){
          $(node.eq(i)).addClass("rumorhighlight");
          $(node.eq(i)).attr('data-rumortext', rumortext);
          $(node.eq(i)).attr('data-rumornum', rumornum);
          $(node.eq(i)).attr('data-teiseinum', correction_cnt);
          $(node.eq(i)).attr('data-correction', correction);
          $(node.eq(i)).attr('data-query', search_query);
        }
      }
      var result = node_search(node.eq(i),rumorline);
      if(result == 1){
        $(node.eq(i)).removeClass("rumorhighlight");
        $(node.eq(i)).attr('data-rumortext', "null");
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

//バッジ生成とポップアップリスト表示のためのバックグラウンド送信
function badge(i,str){
  chrome.runtime.sendMessage(
    {type: "count_rumor", count:i, list:str},
    function(res){}
  );
}

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
