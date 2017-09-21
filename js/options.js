$(function(){
  $("#save").click(function () {
    localStorage["twitterID"] = $("#twitterID").val();
    localStorage["twitterpasswd"] = $("#twitterpasswd").val();
    localStorage["fuki"] = $("#fuki").val();
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
});
