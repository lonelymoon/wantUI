/*
** verification Code UI js
*  ver 1.0.0
*  17.04.26
*/

(function(window,document,Math){

var WantVCode = function(options){
	this.layer = document.getElementById("wantUI-vCode-box");
	this.ele = document.getElementById('wantUI-vCode-dialog-box');
	this.beforeIE7 = document.querySelector ? false : true;
	this.init();
};

WantVCode.prototype = {

	init : function(){
		this.close = document.getElementById("wantUI-vCode-close");
		this.inputBox = document.getElementById("wantUI-vCode-inputBox");
		this.resultText = document.getElementById("wantUI-vCode-text");
		this.codeBox = document.getElementById("wantUI-vCode-codeBox");
		this.confirm = document.getElementById("wantUI-vCode-over");
		this.del = document.getElementById("wantUI-vCode-del");
	},

	//显示提示框
	showVCode : function(){
		if( this.display != "none" )
		return false;

		this.__setInnerStyle(this.layer,{
			display:"block"
		});
		this.display = "block";

		this.__initEvent();
	},

	//隐藏提示框
	hideVCode : function(){
		if( this.display == "none" )
		return false;

		this.__setInnerStyle(this.layer,{
			display:"none"
		});
		this.display = "none";

	},

	//设置参数
	setValues : function(options){
		options = options || {};

		/********系统选项*********/
		this.callback = options.callback || this.callback || function(){};

		//(允许)禁止滑动
		this.scrollable = options.scrollable === false ? false : (options.scrollable || this.scrollable);
	
		//更新dom
		this.__initDom();
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
		this.hideVCode();
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

		this.resultText.innerHTML = resChars.join("");

		for( var x = 0,len = allChars.length; x < len; x++ ){
			temp += '<div class="wantUI-vCode-codeList">'+allChars[x]+'</div>';
		}
		temp += '<div class="clear"></div>';
		this.codeBox.innerHTML = temp;

		this.__getHeight();
		this.__setMiddle();
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
		var _self = this,
			clickNum = 0;
		
		var testClass = function(ele,str){
			var className = ele.className,
				reg = new RegExp(str,"g");
			return reg.test(className);
		};

		var inputTexts = this.inputBox.getElementsByTagName("div"),
			inputsArray = [];

		for( var i = 0, len = inputTexts.length; i < len; i++ ){
			var inp = inputTexts[i];
			if(testClass(inp,"wantUI-vCode-inputList")){
				inputsArray.push(inp);
			}
		}

		this.close.onclick = function(e){
			_self.custom();
		};

		this.codeBox.onclick = function(e){
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

		this.del.onclick = function(e){
			if(clickNum <= 0){
				return false;
			}
			clickNum--;
			inputsArray[clickNum].innerHTML = "";
		};

		this.confirm.onclick = function(e){
			var temp = "";
			for( var i = 0, len = inputsArray.length; i < len; i++ ){
				temp += inputsArray[i].innerHTML;
			}
			if( clickNum == 4 && _self.resultText.innerHTML == temp ){
				console.log("pass");
				_self.callback();
			} else {
				console.log("unpass");
			}
		};

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
	module.exports = new WantVCode();
} else if( typeof define == "function" && define.amd ){
	define(function(){ return new WantVCode();});
} else {
	window.wantVCode = new WantVCode();
}

})(window,document,Math,undefined);