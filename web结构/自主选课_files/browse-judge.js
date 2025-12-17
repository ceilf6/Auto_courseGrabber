//判断操作系统和浏览器类型，需要判断的页面加上detectOS()；
function detectOS() { 
	var sUserAgent = navigator.userAgent; 
	var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
	
	if (isWin) { 
		var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1; 
		var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1; 
		var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1; 
		var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1; 
		var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1; 
		
		if(navigator.userAgent.indexOf("MSIE 6.0")>0 || navigator.userAgent.indexOf("MSIE 7.0")>0){ //IE6.0和IE7.0
			window.location.href = _path+"/xtgl/init_cxBrowser.html";
		}
		else if(navigator.userAgent.indexOf("MSIE 8.0")>0){//IE8.0
			if (isWin2K  || isWinXP || isWin2003 || isWinVista){ //xp系统和其他低版本系统
				$(document.body).append("<div class='tips_top'><div class='w_1000'><span>亲爱的用户，为了达到最优的网站体验效果，我们建议您安装/使用下列最新版本浏览器：</span><ul class='browser_list'><li><a href='http://www.google.cn/intl/zh-CN/chrome/browser/' target='_blank'><i class='ico_browser c'></i>chrome</a></li><li><a  href='http://www.firefox.com.cn/download/' target='_blank'><i class='ico_browser f'></i>Firefox</a></li><li><a href='http://support.apple.com/kb/DL1531?viewlocale=zh_CN' target='_blank'><i class='ico_browser s'></i>safari</a></li></ul><a href='javascript:;' class='close' onclick='removeerror()'><i class='ico_browser'></i></a></div></div>");
			}
			else if (isWin7) //w7系统
			{
				$(document.body).append("<div class='tips_top'><div class='w_1000'><span>亲爱的用户，为了达到最优的网站体验效果，我们建议您安装/使用下列最新版本浏览器：</span><ul class='browser_list'><li><a  href='http://windows.microsoft.com/zh-cn/internet-explorer/download-ie' target='_blank'><i class='ico_browser i'></i>Internet Explorer 11</a></li><li><a href='http://www.google.cn/intl/zh-CN/chrome/browser/' target='_blank'><i class='ico_browser c'></i>chrome</a></li><li><a  href='http://www.firefox.com.cn/download/' target='_blank'><i class='ico_browser f'></i>Firefox</a></li><li><a href='http://support.apple.com/kb/DL1531?viewlocale=zh_CN' target='_blank'><i class='ico_browser s'></i>safari</a></li></ul><a href='javascript:;' class='close' onclick='removeerror()'><i class='ico_browser'></i></a></div></div>");
			}
		}
		
	}
}


//移除提示代码
function removeerror(text){
	$(".tips_top").animate({top:"-35px"},function(){$(".tips_top").remove()});
}

/***
 * 获取浏览器信息
 * @author majun
 * @return
 */
var broswer = function() {
    var _broswer = {};
    var sUserAgent = navigator.userAgent;
    //console.info("useragent: ", sUserAgent);
    var isOpera = sUserAgent.indexOf("Opera") > -1;
    if (isOpera) {
        //首先检测Opera是否进行了伪装
        if (navigator.appName == 'Opera') {
            //如果没有进行伪装，则直接后去版本号
            _broswer.version = parseFloat(navigator.appVersion);
        } else {
            var reOperaVersion = new RegExp("Opera (\\d+.\\d+)");
            //使用正则表达式的test方法测试并将版本号保存在RegExp.$1中
            reOperaVersion.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
        }
        _broswer.opera = true;
    }
    var isChrome = sUserAgent.indexOf("Chrome") > -1;
    if (isChrome) {
        var reChorme = new RegExp("Chrome/(\\d+\\.\\d+(?:\\.\\d+\\.\\d+))?");
        reChorme.test(sUserAgent);
        _broswer.version = parseFloat(RegExp['$1']);
        _broswer.chrome = true;
    }
    //排除Chrome信息，因为在Chrome的user-agent字符串中会出现Konqueror/Safari的关键字
    var isKHTML = (sUserAgent.indexOf("KHTML") > -1
            || sUserAgent.indexOf("Konqueror") > -1 || sUserAgent
            .indexOf("AppleWebKit") > -1)
            && !isChrome;
    if (isKHTML) {//判断是否基于KHTML，如果时的话在继续判断属于何种KHTML浏览器
        var isSafari = sUserAgent.indexOf("AppleWebKit") > -1;
        var isKonq = sUserAgent.indexOf("Konqueror") > -1;
        if (isSafari) {
            var reAppleWebKit = new RegExp("Version/(\\d+(?:\\.\\d*)?)");
            reAppleWebKit.test(sUserAgent);
            var fAppleWebKitVersion = parseFloat(RegExp["$1"]);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.safari = true;
        } else if (isKonq) {
            var reKong = new RegExp(
                    "Konqueror/(\\d+(?:\\.\\d+(?\\.\\d)?)?)");
            reKong.test(sUserAgent);
            _broswer.version = parseFloat(RegExp['$1']);
            _broswer.konqueror = true;
        }
    }
    // !isOpera 避免是由Opera伪装成的IE  
    var isIE = sUserAgent.indexOf("Trident") > -1 && !isOpera;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(sUserAgent);
        _broswer.version = parseFloat(RegExp['$1']);
        _broswer.msie = true;
    }
    // 排除Chrome 及 Konqueror/Safari 的伪装
    var isMoz = sUserAgent.indexOf("Gecko") > -1 && !isChrome && !isKHTML;
    if (isMoz) {
        var reMoz = new RegExp("rv:(\\d+\\.\\d+(?:\\.\\d+)?)");
        reMoz.test(sUserAgent);
        _broswer.version = parseFloat(RegExp['$1']);
        _broswer.mozilla = true;
    }
    return _broswer;
}

/**
 * 	console.info("broswer.version: ", broswer.version);
	console.info("broswer.msie is ", broswer.msie);//360 iE9
	console.info("broswer.safari is ", broswer.safari);//苹果
	console.info("broswer.opera is ", broswer.opera);
	console.info("broswer.mozilla is ", broswer.mozilla);//火狐  IE11
	console.info("broswer.chrome is ", broswer.chrome);//google baidu
	console.info("broswer.konqueror is ", broswer.konqueror);
 */

