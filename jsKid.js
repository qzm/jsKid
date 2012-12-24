function jsKid() {
	//下面的$都代表jsKid
	var $=this;
	//拓展系统方法
	//类的继承 参考：prototype
	Object.extend = function(des, source) {
		if(typeof source === 'object') {
			for(var key in source) {
				des[key] = source[key];
			}
		}
		return des;
	};
	//拓展Object方法
	Object.extend(Object, {
		//用字符串表示对象
		inspect: function(object) {
			try {
				if(typeof object === 'undefined')
					return 'undefined';
				if(typeof object === 'null')
					return 'null';
				return object.inspect ? object.inspect() : object.toString();
			} catch(e) {
				if(e instanceof RangeError) return '...';
				throw e;
			}
		},
		//获得对象中所有的key值
		keys: function(object) {
			var keys = [];
			for(var property in object)
				keys.push(property);
			return keys;
		},
		//获得对象中所有的value值
		values: function(object) {
			var values = [];
			for(var property in object)
				values.push(object[property]);
			return values;
		},
		//复制一个对象
		clone: function(object) {
			return Object.extend({}, object);
		}
	});
	//预定义参数和模块，其他模块可动态添加
	$.debug=true;
	$.model = null;
	$.view = null;
	$.contraller = null;
	$.sprite=null;
	$.notify=null;
	$.canvas = null;
	$.context = null;
	$.e=null;			//事件冒泡
	// 初始化资源
	$.version = {
		info: '命名为jsKid,是觉得这个核心库很不成熟,希望它能想一个孩子一样茁壮成长',
		name: 'jsKid',
		version: '1.0',
		author: 'QZM',
		eMail: 'q.hn@163.com'
	};
	//IE标示
	$.browser = true;
	//初始化,以函数作为参数
	$.init = function(args) {
		args();
	};
	$.initImg = function(imgSrc) {
		var img = new Image();
		img.src = imgSrc;
		return img;
	};
	$.transform=function(img){
		img=img.rotate(Math.PI/2);
		return img;
	};
	$.initImgTranX = function(imgSrc) {
		var img = new Image();
		img.src = imgSrc;
		return img;
	};
	//内存缓存,防止破坏命名空间
	$.Cache = {
		map: [],
		//设置缓存
		set: function(key, value) {
			$.Cache.map[key] = value;
		},
		//获得缓存
		get: function(key) {
			return $.Cache.map[key];
		},
		//判断时候存在缓存
		havekey: function(key) {
			if($.Cache.get(key)) {
				return false;
			} else {
				return true;
			}
		},
		//移除缓存
		remove: function(key) {
			delete $.Cache.map[key];
		},
		//缓存自增 类似于 i+=step
		plus: function(key, step) {
			return $.Cache.map[key] += step;
		}
	};
	window.requestAnimationFrame = (function() {
		return	window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				//火狐的mozRequestAnimationFrame 没有setTimeout稳定，抖动厉害
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function(callback){ setTimeout (callback, 1000 / 60);};
	})();
	//cancelAnimationFrame
	window.cancelAnimationFrame = (function() {
		return	window.cancelAnimationFrame        ||
				window.webkitCancelAnimationFrame  ||
				//火狐的mozRequestAnimationFrame 没有setTimeout稳定，抖动厉害
				window.mozCancelAnimationFrame     ||
				window.oCancelAnimationFrame       ||
				window.msCancelAnimationFrame      ||
				window.clearTimeout;
	})();
	//动画入口
	$.run = function(funtionToRun) {
		//循环体
		(function _worker() {
			funtionToRun();
			window.requestAnimationFrame(_worker);
		})();
	};
	//Canvas 相关
	$.Canvas = {
		//初始化,获得Canvas中的Context 2D
		init: function() {
			var _c = document.getElementsByTagName('canvas')[0];
			return _c.getContext("2d");
		},
		//获得Canvas元素
		base: function() {
			return document.getElementsByTagName('canvas')[0];
		}
	};
	$.clearScreen=function(){

	};
	//document 选择封装
	$.Dom = function(args) {
		if(args[0]) {
			switch(args[0]) {
			case '#':
				//getElementById 的封装
				return document.getElementById(args.substring(1, args.length));
			case '@':
				//getElementsByName 的封装
				return document.getElementsByName(args.substring(1, args.length));
			case '$':
				//getElementsByTagName 的封装
				return document.getElementsByTagName(args.substring(1, args.length));
			case '.':
				//getElementsByClass 的封装
				return document.getElementsByClassName(args.substring(1, args.length));
			default:
				return null;
			}
		}
		return null;
	};
	//log日志
	$.l=function(msg){
		if(console&&$.debug){
			console.log(msg);
		}
	};
	//Ajax封装
	$.Ajax =function (){
		var ajax=this;
		var xmlhttp=(function() {
			var xhr=window.XMLHttpRequest						||
					window.ActiveXObject("Microsoft.XMLHTTP")	||
					window.ActiveXObject("Msxml2.XMLHTTP");
			return new xhr();
		})();
		//封装send方法
		ajax.send=function(args) {
			var method=args.method||'GET';
			var url   =args.url   ||'';
			var async =args.async ||true;
			var data  =args.data  ||null;
			try{
				xmlhttp.open(method, url, async);
				xmlhttp.send(data);
			}catch(e){
				alert('Ajax异常，可能是本地代码的问题，将JS代码放到服务器上试试');
			}
			return ajax;
		};
		//封装response方法
		ajax.response=function(callback,free) {
			var _free=free||null;
			//监听返回数据
			xmlhttp.onreadystatechange=function() {
				if(xmlhttp.readyState == 4) {
					if(xmlhttp.status == 200) {
						var data=	xmlhttp.responseText ||
									xmlhttp.responseXML  ||
									xmlhttp.responseBody;
						callback(data);
					}
				}
			};
			//第二个回调函数，用于回收ajax对象，可选
			xmlhttp.onloadend=function(){
				if(_free&&xmlhttp.status){
					xmlhttp.status=0;
					_free.call();
				}
			};
			return ajax;
		};
		ajax.base=function(){
			return $;
		};
		return ajax;
	};
	//Ajax池封装
	$.AjaxPool=function(thread){
		var ajaxpool=this;
		var ajaxList=[];
		var waitList=[];
		for(var i=0;i<thread;i++){
			ajaxList[i]=new $.Ajax();
		}
		ajaxpool.get=function(worker){
			var xmlHttpObject=ajaxList.shift();
			if(xmlHttpObject){
				return xmlHttpObject;
			}else{
				xmlHttpObject=new $.Ajax();
				ajaxList.push(xmlHttpObject);
				return xmlHttpObject;
			}
		};
		ajaxpool.free=function(xmlHttpObject){
			ajaxList.push(xmlHttpObject);
		};
	};
	//JSON对象重构
	$.JSON = {
		//From:jQuery 1.8.3
		//将字符串格式化成JSON
		parse: function(data) {
			if ( window.JSON && window.JSON.parse ) {
				return window.JSON.parse( data );
			}
			// JSON RegExp
			var	rvalidchars = /^[\],:{}\s]*$/,
				rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
				rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
				rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g;
			// Make sure the incoming data is actual JSON
			// Logic borrowed from http://json.org/json2.js
			if ( rvalidchars.test( data.replace( rvalidescape, "@" )
				.replace( rvalidtokens, "]" )
				.replace( rvalidbraces, "")) ) {
				return ( new Function( "return " + data ) )();
			}
		},
		//将JSON格式化成字符串
		stringify: function(json) {
			if ( window.JSON && window.JSON.parse ) {
				var _l='{',_r='}';
				if(typeof(json)=='Array'){
					_l='[';_r=']';
				}
				var JSON = window.JSON || null;
				try{
					if(JSON) {
						//原生支持
						return JSON.stringify(json);
					} else {
						//IE支持
						var jsonString = _l,type,value;
						for(var key in json) {
							type = typeof(json[key]);
							switch(type) {
								case 'object':
									value=json[key]?$.JSON.stringify(json[key]):'null';
									jsonString = jsonString + '"' + key + '":' + value + ',';
									break;
								case 'string':
									jsonString = jsonString + '"' + key + '":"' + json[key] + '",';
									break;
								default:
									jsonString = jsonString + '"' + key + '":' + json[key] + ',';
							}
						}
						jsonString=jsonString.substring(0,jsonString.length-1);
						jsonString+=_r;
						return jsonString;
					}
				}catch(e){
					$.l('JSON.stringify:'+e.type);
					return null;
				}

			} else {
				return '';
			}
		}
	};

	//扩展系统方法


	//将字符串转换成int类型
	window.String.prototype.toInt=function(){
		return window.parseInt(this);
	};
	//将字符串转换成JSON类型
	window.String.prototype.toJSON=window.parseJSON=function(str){
		return $.JSON.parse(str||this);
	};
	//将字符串转化成数组
	window.String.prototype.toArray=window.parseArray=function(str){
		return Array.prototype.slice.call(str||this);
	};
	//判断字符串是否是邮件
	window.String.prototype.isEmail=window.isEmail=function(str){
		return (/^[\w_\.]+@[\w_\.]+\.[a-zA-Z]+$/).test(str||this);
	};
	//判断字符串是否是手机号码
	window.String.prototype.isMobile=window.isMobile=function(str){
		return (/^1[358]\d{9}$/).test(str||this);
	};
	//判断字符串是否是身份证号码
	window.String.prototype.isIdCard=window.isIdCard=function(str){
		return (/^(\d{15})$|^(\d{17}[\d\*]$)/).test(str||this);
	};
	window.String.prototype.isNumber=window.isNumber=function(str){
		return (/^[1-9]\d+$/).test(str||this);
	};
	//随机取出数组中的一个值
	window.Array.prototype.random = function() {
		return this[window.Math.floor(Math.random()*this.length)];
	};
	//取出数组中最大的一个数
	window.Array.prototype.max=function() {
		for(var i=0,_max=this[0];i<this.length;i++){
			_max=Math.max(_max,this[i]);
		}
		return _max;
	};
	//取出数组中最小的一个数
	window.Array.prototype.min=function() {
		for(var i=0,_min=this[0];i<this.length;i++){
			_min=Math.min(_min,this[i]);
		}
		return _min;
	};
	window.Array.prototype.enqueue=window.Array.prototype.push;
	window.Array.prototype.dequeue=window.Array.prototype.shift;
	window.Math.distance=function(point1,point2){
		var	_x=point1.x-point2.x,
			_y=point2.y-point2.y,
			_x2=_x*_x,
			_y2=_y*_y;
		return Math.sqrt(_x2+_y2);
	};

}