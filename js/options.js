var str1 = '<h2><span style="color: #800080;">●水道料金格差</span></h2>';
var str2 = ["高度プロでは、労働者に裁量があるから、残業を命じられることはない",""];
for(var i=0;i<str2.length;i++){
  var text = str2[i];
  var result = levenshteinDistance(str1,str2[i]);
  console.log(str1+"："+str1.length);
  console.log(str2[i]+"："+text.length);
  console.log("距離："+result);
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
    if(x>=y){
      return d[x][y]/x;
    }else{
      return d[x][y]/y;
    }
}
