function render(template, context) {

    var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

    return template.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {
            return word.replace('\\', '');
        }

        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;

        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    });
}
String.prototype.render = function (context) {
    return render(this, context);
};

//这个方法在最新版chrome已无法使用
// var re = /x/;
// console.log(re);
// re.toString = function() {
//     showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 5000);
//     return '';
// };

var x = document.createElement('br');
Object.defineProperty(x, 'id', {
    get: function () {
        showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 5000);
        console.log('想知道我的构成秘密？那么请您慢慢看吧');
        return '';
    }
});
console.log(x);


$(document).on('copy', function () {
    showMessage('你都复制了些什么呀，转载要记得加上出处哦', 5000);
});


$('.waifu-tool .waifu-closed').click(function () {
    showMessage('愿你有一天能与重要的人重逢', 1300, true);
    window.setTimeout(function () { hideWaifu(); }, 1300);
});
$('.waifu').mouseenter(function () {
    //显示工具栏
    $('.waifu-tool').removeClass('off');
    $('.waifu-tool').addClass('on');
})
$('.waifu').mouseleave(function () {
    //关闭工具栏
    $('.waifu-tool').removeClass('on');
    $('.waifu-tool').addClass('off');

})
$('.waifu-switch').click(function () {
    //打开live2d
    showWaifu();

})


$.ajax({
    cache: true,
    url: "/live2d/waifu-tips.json",
    dataType: "json",
    success: function (result) {
        $.each(result.mouseover, function (index, tips) {
            $(document).on("mouseover", tips.selector, function () {
                var text = tips.text;
                if (Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
                text = text.render({ text: $(this).text() });
                showMessage(text, 3000);

            });
        });
        $.each(result.click, function (index, tips) {
            $(document).on("click", tips.selector, function () {
                var text = tips.text;
                if (Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1) - 1];
                text = text.render({ text: $(this).text() });
                showMessage(text, 3000);
            });
        });
    }
});

(function () {
    //检查是否是PC端
    if (isPC()) {
        hideAll();
    } else {
        //是否需启动live2d
        if (checkWaifuSwitch()) {
            showWaifu();
        } else {
            hideWaifu();
        }
    }


    var text;
    if (document.referrer !== '') {
        var referrer = document.createElement('a');
        referrer.href = document.referrer;
        text = 'Hello! 来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友';
        var domain = referrer.hostname.split('.')[1];
        if (domain == 'baidu') {
            text = 'Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&wd=')[1].split('&')[0] + '</span> 找到的我吗？';
        } else if (domain == 'so') {
            text = 'Hello! 来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&q=')[1].split('&')[0] + '</span> 找到的我吗？';
        } else if (domain == 'google') {
            text = 'Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
        }
    } else {
        if (window.location.href == 'http://zazalu.space/') { //如果是主页
            var now = (new Date()).getHours();
            if (now > 23 || now <= 5) {
                text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛';
            } else if (now > 5 && now <= 7) {
                text = '早上好！一日之计在于晨，美好的一天就要开始了';
            } else if (now > 7 && now <= 11) {
                text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
            } else if (now > 11 && now <= 14) {
                text = '中午了，工作了一个上午，现在是午餐时间！';
            } else if (now > 14 && now <= 17) {
                text = '午后很容易犯困呢，今天的运动目标完成了吗？';
            } else if (now > 17 && now <= 19) {
                text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~';
            } else if (now > 19 && now <= 21) {
                text = '晚上好，今天过得怎么样？';
            } else if (now > 21 && now <= 23) {
                text = '已经这么晚了呀，早点休息吧，晚安~';
            } else {
                text = '嗨~ 快来逗我玩吧！';
            }
        } else {
            text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
        }
    }
    showMessage(text, 6000);
})();

window.setInterval(showHitokoto, 30000);

function showHitokoto() {
    $.getJSON('https://api.imjad.cn/hitokoto/?cat=&charset=utf-8&length=28&encode=json', function (result) {
        showMessage(result.hitokoto, 5000);
    });
}

function showMessage(text, timeout) {
    if (Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1) - 1];
    // console.log(text); 控制台输出太多没用log，所以舍弃
    $('.waifu-tips').stop();
    $('.waifu-tips').html(text).fadeTo(200, 1);
    if (timeout === null) timeout = 5000;
    hideMessage(timeout);
}
function hideMessage(timeout) {
    $('.waifu-tips').stop().css('opacity', 1);
    if (timeout === null) timeout = 5000;
    $('.waifu-tips').delay(timeout).fadeTo(200, 0);
}
function showWaifu() {
    sessionStorage.setItem('waifu-switch', 'on');
    $('.waifu-switch').css('display', 'none');
    $('.waifu').show();
}
function hideWaifu() {
    sessionStorage.setItem('waifu-switch', 'close');
    $('.waifu-switch').css('display', 'block');
    $('.waifu').hide();
}
function hideAll() {
    $('.waifu-switch').css('display', 'none');
    $('.waifu').hide();
}
function checkWaifuSwitch() {
    var s = sessionStorage.getItem('waifu-switch');
    console.log(s);

    if (s == 'close') {
        return false;
    } else if (s == 'on') {
        return true;
    } else {
        return false;
    }
}

function isPC() {
    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            //Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36
            return {//移动终端浏览器版本信息 
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 , //android终端
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad  
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    
    if (browser.versions.mobile || browser.versions.ios || browser.versions.android ||
        browser.versions.iPhone || browser.versions.iPad) {
        return true;
    } else {
        return false;
    }
}
