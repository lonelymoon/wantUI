/*
** dialog Mix UI js
*  ver 1.2.0
*  17.04.25
*/

(function(window,document,Math){

//UI settings
var Simple = {};

Simple.alert = {
	dom : '<div class="wantUI-dialog-baseFontColor wantUI-dialog-commonBgColor" id="wantUI-alert-title"></div>'+
			'<div class="wantUI-dialog-baseBgColor" id="wantUI-alert-msg"></div>'+
			'<div class="wantUI-dialog-baseFontColor wantUI-dialog-commonBgColor" id="wantUI-alert-btn"></div>',
	setData : function(target,opts){
		var cache = this.cache;	
		cache.title = opts.title || cache.title || "提示",
		cache.msg 	= opts.msg 	 || cache.msg 	|| "并没有任何提示信息",
		cache.btn 	= opts.btn 	 || cache.btn 	|| "确认";
		cache.callback = opts.callback || cache.callback || function(){};

		var title = document.getElementById("wantUI-alert-title");

		if(!opts.showTitle && opts.showTitle === false){
			target.__setInnerStyle(title,{display:"none"});
		} else {
			target.__delInnerStyle(title);
		}

		title.innerHTML = cache.title;
		document.getElementById("wantUI-alert-msg").innerHTML = cache.msg;
		document.getElementById("wantUI-alert-btn").innerHTML = cache.btn;
	},
	bindEvent : function(target){
		var btn = document.getElementById("wantUI-alert-btn"),
			_self = this;
		btn.onclick = function(e){
			target.custom();
			_self.cache.callback.call(this,e);
		};
	},
	cache : {}
};

Simple.confirm = {
	dom : '<div id="wantUI-confirm-title" class="wantUI-dialog-baseFontColor wantUI-dialog-commonBgColor"></div>'+
		'<div id="wantUI-confirm-msg" class="wantUI-dialog-baseBgColor"></div>'+
		'<div id="wantUI-confirm-fn" class="wantUI-dialog-baseBgColor">'+
			'<div id="wantUI-confirm-cancel" class="wantUI-confirm-btn wantUI-dialog-baseFontColor wantUI-dialog-commonBgColor"></div>'+
			'<div id="wantUI-confirm-pass" class="wantUI-confirm-btn wantUI-dialog-baseFontColor wantUI-dialog-commonBgColor"></div>'+
			'<div class="clear"></div>'+
		'</div>',
	setData : function(target,opts){
		var cache = this.cache;	
		cache.title = opts.title || cache.title || "提示",
		cache.msg 	= opts.msg 	 || cache.msg 	|| "并没有任何提示信息",
		cache.pass 	= opts.pass  || cache.pass 	|| "确认";
		cache.cancel= opts.cancel|| cache.cancel|| "取消";
		cache.succCallback = opts.succCallback || cache.succCallback || function(){};
		cache.cancCallback = opts.cancCallback || cache.cancCallback || function(){};

		var title = document.getElementById("wantUI-confirm-title");

		if(!opts.showTitle && opts.showTitle === false){
			target.__setInnerStyle(title,{display:"none"});
		} else {
			target.__delInnerStyle(title);
		}

		title.innerHTML = cache.title;
		document.getElementById("wantUI-confirm-msg").innerHTML = cache.msg;
		document.getElementById("wantUI-confirm-pass").innerHTML = cache.pass;
		document.getElementById("wantUI-confirm-cancel").innerHTML = cache.cancel;
	},
	bindEvent : function(target){
		var pass = document.getElementById("wantUI-confirm-pass"),
			cancel = document.getElementById("wantUI-confirm-cancel"),
			_self = this;

		pass.onclick = function(e){
			target.custom();
			_self.cache.succCallback.call(this,e);
		};

		cancel.onclick = function(e){
			target.custom();
			_self.cache.cancCallback.call(this,e);
		};
	},
	cache : {}
};

Simple.imgWall = {
	dom : '<div id="wantUI-imgWall-wrapper">'+
				'<div id="wantUI-imgWall-imgbox">'+
					'<img src="" id="wantUI-imgWall-img">'+
				'</div>'+
				'<div class="wantUI-fn-box">'+
					'<div id="wantUI-imgWall-prev">prev</div>'+
					'<div id="wantUI-imgWall-next">next</div>'+
				'</div>'+
			'</div>',
	setData : function(target,opts){
		var cache = this.cache,
			img = document.getElementById("wantUI-imgWall-img");

		cache.url = opts.url; //链接
		cache.idx = opts.idx; //索引
		cache.callback = opts.callback || function(){}; //回调

		cache.attr = opts.attr || cache.attr || "data-wantui-idx";

		if(cache.url && cache.idx || cache.idx === 0){
			img.onload = function(e){
				target.__getHeight();
				target.__setMiddle();
				cache.callback(e);
			};
			img.src = cache.url;
		}
	},
	bindEvent : function(target){
		var cache = this.cache,
			attr = cache.attr,
			next = document.getElementById("wantUI-imgWall-next"),
			prev = document.getElementById('wantUI-imgWall-prev');

		target.layer.onclick = function(e){
			target.custom();
		};

		function check(condition,callback){
			var imgs = document.getElementsByTagName("img");
			for( var i = 0, img; img = imgs[i++]; ){
				var id = img.getAttribute(attr),
					src = img.src;

				if( id && id == condition ){
					target.setValues({
						url : src,
						idx : condition
					});

					return;
				}
			}
		}
		
		next.onclick = function(e){
			e = e || event;
			target.__preventDefault(e);
			target.__stopBubble(e);
			check(cache.idx * 1 + 1);
		};

		prev.onclick = function(e){
			e = e || event;
			target.__preventDefault(e);
			target.__stopBubble(e);
			check(cache.idx - 1);
		};

	},
	cache : {}
};

Simple.vCode = {
	dom : '<div id="wantUI-vCode-close">X</div>'+
		'<div id="wantUI-vCode-inputBox">'+
			'<div class="wantUI-vCode-inputList"></div>'+
			'<div class="wantUI-vCode-inputList"></div>'+
			'<div class="wantUI-vCode-inputList"></div>'+
			'<div class="wantUI-vCode-inputList"></div>'+
			'<div class="clear"></div>'+
		'</div>'+
		'<div class="wantUI-vCode-msg">请点选“<span id="wantUI-vCode-text"></span>”作为文字验证码</div>'+
		'<div id="wantUI-vCode-codeBox">'+
		'</div>'+
		'<div class="wantUI-vCode-btnBox">'+
			'<div id="wantUI-vCode-over" class="wantUI-vCode-btn wantUI-dialog-baseFontColor wantUI-dialog-commonBgColor">确认</div>'+
			'<div id="wantUI-vCode-del" class="wantUI-vCode-btn wantUI-dialog-commonFontColor wantUI-dialog-baseBgColor">撤销</div>'+
			'<div class="clear"></div>'+
		'</div>',

	setData : function(target,opts){
		var cache = this.cache,
			resultText = document.getElementById("wantUI-vCode-text"),
			codeBox = document.getElementById("wantUI-vCode-codeBox");

		cache.callback = opts.callback || cache.callback || function(){};
		//原理: 通过某一范围内的10进制数转化成16进制，然后生成对应的万国码
		var getRandomChars = function(num){
			var arr = [];
			for( var i = 0; i < num; i++ ){
				var rand = (Math.random() * (endNum - startNum) + startNum) >> 0,
					int_16 = rand.toString(16),
					text = unescape("%u"+int_16);

				arr.push(text);
			}
			return arr;
		}, getRandomInArray = function(arr,num){
			var nArr = arr.concat(),
				resultArr = [];
			for( var i = 0; i < num; i++ ){
				var idx = (Math.random() * nArr.length) >> 0,
					res = nArr.splice(idx,1);

				resultArr.push(res);
			}
			return resultArr;
		};

		var startNum = 19968,
			endNum = 40869,
			allChars = [],
			resChars = [],
			temp = "";
		//首先生成9个字符
		allChars = getRandomChars(9);
		//获取随机挑选的4个汉字
		resChars = getRandomInArray(allChars,4);

		resultText.innerHTML = resChars.join("");

		for( var x = 0,len = allChars.length; x < len; x++ ){
			temp += '<div class="wantUI-vCode-codeList">'+allChars[x]+'</div>';
		}
		temp += '<div class="clear"></div>';
		codeBox.innerHTML = temp;
	},

	bindEvent : function(target){
		var _self = this,
			clickNum = 0,
			inputBox = document.getElementById("wantUI-vCode-inputBox"),
			resultText = document.getElementById("wantUI-vCode-text"),
			close = document.getElementById("wantUI-vCode-close"),
			codeBox = document.getElementById("wantUI-vCode-codeBox"),
			confirm = document.getElementById("wantUI-vCode-over"),
			del = document.getElementById("wantUI-vCode-del");
		
		var testClass = function(ele,str){
			var className = ele.className,
				reg = new RegExp(str,"g");
			return reg.test(className);
		};

		var inputTexts = inputBox.getElementsByTagName("div"),
			inputsArray = [];

		for( var i = 0, len = inputTexts.length; i < len; i++ ){
			var inp = inputTexts[i];
			if(testClass(inp,"wantUI-vCode-inputList")){
				inputsArray.push(inp);
			}
		}

		close.onclick = function(e){
			target.custom();
		};

		codeBox.onclick = function(e){
			e = e || event;
			var target = e.target || e.srcElement;
			if(!testClass(target,"wantUI-vCode-codeList")){
				return false;
			}

			if(clickNum > 3){
				return false;
			}

			inputsArray[clickNum].innerHTML = target.innerHTML;
			clickNum++;
		};

		del.onclick = function(e){
			if(clickNum <= 0){
				return false;
			}
			clickNum--;
			inputsArray[clickNum].innerHTML = "";
		};

		confirm.onclick = function(e){
			var temp = "";
			for( var i = 0, len = inputsArray.length; i < len; i++ ){
				temp += inputsArray[i].innerHTML;
			}
			if( clickNum == 4 && resultText.innerHTML == temp ){
				console.log("pass");
				_self.cache.callback();
			} else {
				console.log("unpass");
			}
		};
	},
	cache : {}

};

//////////////////////////////////////////////////////

var WantDialog = function(options){
	this.layer = document.getElementById("wantUI-dialog-box");
	this.ele = document.getElementById('wantUI-dialog');
	this.scrollable = false;
	this.beforeIE7 = document.querySelector ? false : true;
};

WantDialog.prototype = {

	init : function(type,opts){
		this.ui = Simple[type];
		this.opts = opts || {};

		if(!this.ui) return false;
		this.type = type;
		this.hasBind = false; //防止重复操作
		this.__initDom();
		this.__replaceData(); //替换dom中相关的数据
		this.__getHeight();
		this.__setMiddle();
	},

	//显示会话框
	show : function(){
		if( this.display != "none" )
		return false;

		this.__setInnerStyle(this.layer,{
			display:"block"
		});
		this.display = "block";

		this.__initEvent();
	},

	//隐藏会话框
	hide : function(){
		if( this.display == "none" )
		return false;

		this.__setInnerStyle(this.layer,{
			display:"none"
		});
		this.display = "none";

	},

	//设置参数
	setValues : function(options){
		this.opts = options || this.opts || {};
		//更新dom
		this.__replaceData();
	},

	//单独设置参数
	setValue : function(key,val){
		if(!key) return false;
		var tempObj = {};
		tempObj[key] = val;
		this.setValues(tempObj);
	},

	//系统设定点击回调事件
	custom : function(){
		this.hide();
	},

	//系统初始化事件
	__initEvent : function(){
		if( this.hasBind )
		return false;

		this.__forbidden();
		this.__bindEvent();

		this.hasBind = true;
	},

	//系统初始化dom
	__initDom : function(){
		var wrapper = document.getElementById("wantUI-dialog");

		this.__setInnerStyle(wrapper,{
			display : "none"
		});
		wrapper.setAttribute("data-type",this.type);
		wrapper.innerHTML = this.ui.dom;
		this.__delInnerStyle(wrapper,["display"]);
	},

	//修改dom的数据
	__replaceData : function(){
		this.ui.setData(this,this.opts);
	},

	//preventDefault
	__preventDefault : function(e){
		return e.preventDefault ? e.preventDefault() : e.returnValue = false;
	},

	//stopPropagation
	__stopBubble : function(e){
		return e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	},

	//系统设定禁止某些的操作
	__forbidden : function(){
		var _self = this;

		if(this.scrollable)
		return false;

		_self.layer.onmousewheel = function(e){
			e = e || event;
			_self.__preventDefault(e);
			_self.__stopBubble(e);
		};

		_self.layer.ontouchmove = function(e){
			e = e || event;
			_self.__preventDefault(e);
			_self.__stopBubble(e);
		};
	},

	//绑定点击事件
	__bindEvent : function(){	
		this.ui.bindEvent(this);
	},

	//使提示框垂直居中
	__setMiddle : function(){
		var windowHeight = window.innerHeight || document.documentElement.clientHeight,
			dist = windowHeight - this.height;

		this.__setInnerStyle(this.ele, {
			"marginTop": dist / 2 + "px"
		});
	},

	//获取提示框高度
	__getHeight : function(){
		var ele = this.ele,
			layer = this.layer,
			style = layer.currentStyle || window.getComputedStyle(layer,"null"),
			display = style.display;

		this.display = display;

		if(display != "none"){
			this.height = ele.clientHeight;
			return false;
		}

		this.__setInnerStyle(layer,{
			visibility: "hidden",
			display: "block",
			position: "absolute"
		});
		this.height = ele.clientHeight;
		this.__delInnerStyle(layer,["visibility","display","position"]);
	},

	//方法函数，添加内联style
	__setInnerStyle : function(ele,opts){
		if(this.beforeIE7){
			this.__setInnerStyle = function(ele,opts){
				for( var key in opts ){
					ele.style[key] = opts[key];
				}
			}
		} else {
			this.__setInnerStyle = function(ele,opts){
				var temp = "",
					reg = /([A-Z]+)/g;
				for( var key in opts ){
					var kVal = opts[key];
					key = key.replace(reg,function(val){
						return "-" + val.toLowerCase();
					});
					var tpl = key + ":" + kVal + ";";
					temp += tpl;
				}
				ele.style.cssText = temp;
			};
		}
		this.__setInnerStyle(ele,opts);
	},

	//方法函数, 删除内联style
	__delInnerStyle : function(ele,opts){
		if(this.beforeIE7){
			this.__delInnerStyle = function(ele){
				for( var key, i = 0; key = opts[i++]; ){
					ele.style[key] = "";
				}
			}
		} else {
			this.__delInnerStyle = function(ele){
				ele.style.cssText = "";
			}
		}
		this.__delInnerStyle(ele);
	}
};

if( typeof module != 'undefined' && module.exports ){
	module.exports = new WantDialog();
} else if( typeof define == "function" && define.amd ){
	define(function(){ return new WantDialog();});
} else {
	window.wantDialog = new WantDialog();
}

})(window,document,Math,undefined);