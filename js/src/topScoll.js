$(document).ready(function () {
	var headerinnerOffsetTop = $(".site-meta").offset().top;
	var headerinnerDisappear = $(".site-meta").height();
	var zazaluTotalHeight = headerinnerOffsetTop + headerinnerDisappear;

	$(window).scroll(function () {
		var docTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
		if (docTop > zazaluTotalHeight) {
			if ($(".header-inner-top").css("opacity") == 0) {
				$(".header-inner-top").css("display", "block");
				$(".site-title").css("top", "6px");
				$(".header-inner-top").animate({ opacity: "1" }, 800, "swing");
			}
		} else if (docTop < zazaluTotalHeight) {
			if ($(".header-inner-top").css("opacity") != 0) {
				$(".header-inner-top").css("opacity", "0");
				$(".header-inner-top").css("display", "none");
			}
		}
	})
});