/*
** upload image UI js
*  ver 1.0.0
*  17.05.02
*/

(function(window,document,Math){

var WantUploadImg = function(options){
	this.layer = document.getElementById("wantUI-uploadImg-box");
	this.ele = document.getElementById('wantUI-uploadImg-dialog-box');
	this.beforeIE7 = document.querySelector ? false : true;
	this.init();
};

WantUploadImg.prototype = {

	init : function(){
		this.btn = document.getElementById("wantUI-uploadImg-btn");
		this.close = document.getElementById("wantUI-uploadImg-close");
		this.note = document.getElementById("wantUI-uploadImg-note");
		this.fileEle = document.getElementById("wantUI-uploadImg-upload");
		this.imgBox = document.getElementById("wantUI-uploadImg-imgBox");

		this.__initDom();
	},

	//显示提示框
	showUploadImg : function(){
		if( this.display != "none" )
		return false;

		this.__setInnerStyle(this.layer,{
			display:"block"
		});
		this.display = "block";

		this.__initEvent();
	},

	//隐藏提示框
	hideUploadImg : function(){
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
		this.msg = options.msg || this.msg || "";

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
		if(this.msg){
			this.note.innerHTML = this.msg;
		}
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

		_self.layer.ontouchstart = function(e){
			e = e || event;
			_self.__preventDefault(e);
			_self.__stopBubble(e);
		};
	},

	//绑定点击事件
	__bindEvent : function(){
		var _self = this,
			supportCanvas = !!document.createElement("canvas").getContext, //区别出IE9
			supportFile = document.createElement("input"); 					//区别出IE10以上版本

		supportFile.setAttribute("type","file");

		if(!supportCanvas && document.all){
			document.getElementById("wantUI-uploadImg-label").onclick = function(){
				_self.fileEle.click();
			};
		}
		
		this.close.onclick = function(e){
			_self.custom();
		};

		if(!supportFile.files && document.all){
			this.fileEle.onchange = function(e){
				e = e || event;
				var target = e.target || e.srcElement,
					value = target.value,
					firstChild = _self.imgBox.firstChild;

				var div = document.createElement("div");
				div.className = "wantUI-uploadImg-imgList";
				div.innerHTML = '<img src="'+value+'" class="wantUI-uploadImg-img" />';
				_self.imgBox.insertBefore(div,firstChild);
			};
		} else {
			this.fileEle.onchange = function(e){
				e = e || event;
				var target = e.target;
				console.log(target.files);
			};
		}


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
	module.exports = new WantUploadImg();
} else if( typeof define == "function" && define.amd ){
	define(function(){ return new WantUploadImg();});
} else {
	window.wantUploadImg = new WantUploadImg();
}

})(window,document,Math,undefined);