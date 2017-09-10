
$(document).ready(function () {
	var passwordDiv = $(".protected");
	var url = window.location.href;
	console.log(url);
	if (url === "http://zazalu.space/" || url === "http://localhost:4000/") {
		if (passwordDiv !== undefined) {
			passwordDiv.parent().prev().find("h1").find("a").removeAttr("href");
		}
		$(".passwordButton").click(function () {
			var password = $(this).prev().val();
			if (password === "he65177032") {
				$(this).parent().parent().css("display", "none");
				var targetUrl = passwordDiv.next().find("a").attr("href");
				var newUrl = targetUrl.split("#");
				passwordDiv.next().find("a").attr("href",newUrl[0]);
			} else {
				alert("密码错误");
			}
		});
	}else{
		passwordDiv.css("display", "none");
	}



})
