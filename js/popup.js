$(function(){

  //アカウント情報入力済みの処理
  if (localStorage["twitterID"] && localStorage["twitterpasswd"]) {
    $(".twitterID").text('TwitterID :' + localStorage["twitterID"]);
    $(".twitterpasswd").text('Twitterパスワード :' + localStorage["twitterpasswd"]);
    $(".setbutton").html('<input id="clear" type="button" value="解除">');
  }
  //アカウント情報未入力時の処理
  else{
    $(".twitterID").html('<input id="twitterID" type="text">');
    $(".twitterpasswd").html('<input id="twitterpasswd" type="text">');
    $(".setbutton").html('<input id="save" type="button" value="登録">');
  }
   
   
  //登録ボタンが押されたとき
  $("#save").click(function () {
    localStorage["twitterID"] = $("#twitterID").val();
    localStorage["twitterpasswd"] = $("#twitterpasswd").val();
	$.ajax({
  		type: 
  			'POST',
  		scriptCharset:
			'utf-8',
  		url:
  			'http://ikakun.net/~kakimoto/TweetTest/tweettest.php',
  		data:
  			{twitterID: $("#twitterID").val(), twitterpasswd: $("#twitterpasswd").val()},
  		success:
  			function(data){
  				localStorage["followees"] = data;
  			}
	 });
  });
  
  //解除ボタンが押されたとき
  $("#clear").click(function () {
    localStorage.clear();
  });
  
});
