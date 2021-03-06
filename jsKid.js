/**
 * @return :{Class}
 * @author :QZM
 * @version:1.0
 */
function jsKid() {

	var
		/**
		 * @type:{指针}
		 * @todo:用$代替jsKid的this
		 */
		$=this,
		/**
		 * @type:{Array}
		 * @todo:存放绑定的时间
		 */
		eventList=[];

	/**
	 * @return:{Object}
	 * @see   :Prototype JavaScript framework, version 1.7.1
	 * @todo  :类的继承
	 */
	Object.extend = function(des, source) {
		for(var key in source) {
			des[key] = source[key];
		}
		return des;
	};
	//拓展Object方法
	Object.extend(Object, {
		/**
		 * @param :{object}
		 * @return:{String}
		 * @todo  :用字符串表示对象.
		 */
		inspect: function(object) {
			try {
				if(typeof object === 'undefined')
					return 'undefined';
				if(typeof object === 'null')
					return 'null';
				return object.inspect ? object.inspect() : object+'';
			} catch(e) {
				if(e instanceof RangeError) return '...';
				throw e;
			}
		},
		/**
		 * @param :{object}
		 * @return:{String}
		 * @todo  :获得对象中所有的key值.
		 */
		keys: function(object) {
			var keys = [],property;
			for(property in object)
				keys.push(property);
			return keys;
		},
		/**
		 * @param :{object}
		 * @return:{values}
		 * @todo  :获得对象中所有的value值.
		 */
		values: function(object) {
			var values = [],property;
			for(property in object)
				values.push(object[property]);
			return values;
		},
		/**
		 * @param :{object}
		 * @return:{object}
		 * @todo  :复制一个对象.
		 */
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
	$.canvas = null;
	$.canvasWidth=0;
	$.canvasHeight=0;
	$.context = null;
	$.browser = true;
	/**
	 * 初始化,以函数作为参数 .
	 * @param {Function}
	 */
	$.init = function(args) {
		args();
	};
	/**
	 * 初始化图片.
	 * @param {imgsrc}
	 * @return {img}
	 */
	$.initImg = function(imgSrc) {
		var img = new Image();
		img.src = imgSrc;
		return img;
	};
	window.requestAnimationFrame =  window.requestAnimationFrame       ||
									window.webkitRequestAnimationFrame ||
									//火狐的mozRequestAnimationFrame 没有setTimeout稳定，抖动厉害
									// window.mozRequestAnimationFrame    ||
									window.oRequestAnimationFrame      ||
									window.msRequestAnimationFrame     ||
									function(callback){ setTimeout (callback, 1000 / 60);};
	//cancelAnimationFrame
	window.cancelAnimationFrame =   window.cancelAnimationFrame        ||
									window.webkitCancelAnimationFrame  ||
									//火狐的mozRequestAnimationFrame 没有setTimeout稳定，抖动厉害
									// window.mozCancelAnimationFrame     ||
									window.oCancelAnimationFrame       ||
									window.msCancelAnimationFrame      ||
									window.clearTimeout;
	//游戏是否暂停中
	var pause=false;
	//获取游戏暂停状态
	$.isPause=function(){
		return pause;
	};
	//动画入口
	$.run = function(funtionToRun) {
		//循环体
		function worker() {
			if(!pause){
				funtionToRun();
			}
			window.requestAnimationFrame(worker);
		}
		worker();
	};
	//进行游戏
	$.play=function() {
		pause=false;
	};
	//暂停游戏
	$.pause=function() {
		pause=true;
	};
	//切换暂停和开始
	$.playPause=function() {
		if(pause){
			$.play();
		}else{
			$.pause();
		}
	};

	//Canvas 相关
	$.Canvas = {
		//初始化,获得Canvas中的Context 2D
		init: function() {
			var c = document.getElementsByTagName('canvas')[0];
			return c.getContext("2d");
		},
		//获得Canvas元素
		base: function() {
			return document.getElementsByTagName('canvas')[0];
		}
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
	//绑定事件
	//$.bind(window,['keydown','mousedown'],callback);
	$.bind=function(obj,events,callback){
		//正常浏览器兼容
		var i,j;
		function callbackFn(event) {
			callback(event||window.event);
		}
		if(obj.addEventListener){
			if(typeof events==='string'){
				obj.addEventListener(events,callbackFn);
			}else if(typeof events==='object'){
				for(i in events){
					obj.addEventListener(events[i],callbackFn);
				}
			}
		//IE兼容
		}else if(obj.attachEvent){
			if(typeof events==='string'){
				obj.attachEvent('on'+events,callbackFn);
			}else if(typeof events==='object'){
				for(j in events){
					obj.attachEvent('on'+events[j],callbackFn);
				}
			}
		}
		eventList.push({obj:obj,events:events,callback:callbackFn});
	};
	//触发绑定的事件
	//$.setEvent('keydown',{keyCode:37});
	$.setEvent=function(event,args){
		args=args||null;
		var events=[],
			callbacks=[],
			i,j;
		for(i in eventList){
			if(typeof eventList[i].events!=='undefined'){
				events=events.concat(eventList[i].events);
				callbacks=callbacks.concat(eventList[i].callback);
			}
		}
		for (j = 0; j < events.length; j++) {
			if(events[j]===event){
				callbacks[j](args);
			}
		}
	};
	//log日志
	$.l=function(msg){
		if(console&&$.debug){
			console.log(msg);
		}
	};
	//Ajax封装
	function cresteXHR(){
		if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	}

	$.Ajax =function (){
		var ajax=this,
			xmlhttp=cresteXHR();
		//封装send方法
		ajax.send=function(args) {
			args=Object.extend({
				method:'GET',
				url:'',
				async:true,
				data:null
			},args);
			try{
				xmlhttp.open(args.method, args.url, args.async);
				xmlhttp.send(args.data);
			}catch(e){
				alert('ajaxError');
			}
			return ajax;
		};
		//封装response方法
		ajax.response=function(callback,free) {
			free=free||null;
			//监听返回数据
			xmlhttp.onreadystatechange=function() {
				if(xmlhttp.readyState == 4) {
					// if(xmlhttp.status == 200) {
						var data=   xmlhttp.responseText ||
									xmlhttp.responseXML  ||
									xmlhttp.responseBody;
						callback(data);
					// }
				}
			};
			//第二个回调函数，用于回收ajax对象，可选
			xmlhttp.onloadend=function(){
				if(free&&xmlhttp.status){
					xmlhttp.status=0;
					free.call();
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
		var ajaxpool=this,
			ajaxList=[],
			waitList=[],
			i;
		for(i=0;i<thread;i++){
			ajaxList[i]=$.Ajax();
		}
		ajaxpool.get=function(worker){
			var xmlHttpObject=ajaxList.shift();
			if(xmlHttpObject){
				return xmlHttpObject;
			}else{
				xmlHttpObject=$.Ajax();
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
		//参考：  jQuery JavaScript Library v1.8.3
		//将字符串格式化成JSON
		parse: function(data) {
			if ( window.JSON && window.JSON.parse ) {
				return window.JSON.parse( data );
			}
			// JSON RegExp
			var rvalidchars = /^[\],:{}\s]*$/,
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
		/**
		 * @param {Object} json
		 */
		stringify: function(json) {
			if ( window.JSON && window.JSON.parse ) {
				var l='{',r='}',
					JSON= window.JSON || null,
					key;
				if(typeof(json)=='Array'){
					l='[';r=']';
				}
				try{
					if(JSON) {
						//原生支持
						return JSON.stringify(json);
					} else {
						//IE支持
						var jsonString = l, type, value;
						for(key in json) {
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
						jsonString+=r;
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

	/**
	 * @return:{Integer}
	 * @parme :{[,String]}
	 * @todo  :将字符串转换成int类型
	 */
	window.String.prototype.toInt=function(){
		return window.parseInt(this);
	};
	/**
	 * @return:{JSON}
	 * @parme :{[,String]}
	 * @todo  :将字符串转换成JSON类型
	 */
	window.String.prototype.toJSON=window.parseJSON=function(str){
		return $.JSON.parse(str||this);
	};
	/**
	 * @return:{Array}
	 * @parme :{[,String]}
	 * @todo  :将字符串转化成数组
	 */
	window.String.prototype.toArray=window.parseArray=function(str){
		return Array.prototype.slice.call(str||this);
	};
	/**
	 * @return:{Boolean}
	 * @parme :{[,String]}
	 * @todo  :判断字符串是否是邮件
	 */
	window.String.prototype.isEmail=window.isEmail=function(str){
		return (/^[\w_\.]+@[\w_\.]+\.[a-zA-Z]+$/).test(str||this);
	};
	/**
	 * @return:{Boolean}
	 * @parme :{[,String]}
	 * @todo  :判断字符串是否是手机号码
	 */
	window.String.prototype.isMobile=window.isMobile=function(str){
		return (/^1[358]\d{9}$/).test(str||this);
	};
	/**
	 * @return:{Boolean}
	 * @parme :{[,String]}
	 * @todo  :判断字符串是否是身份证号码
	 */
	window.String.prototype.isIdCard=window.isIdCard=function(str){
		return (/^(\d{15})$|^(\d{17}[\d\*]$)/).test(str||this);
	};
	/**
	 * @return:{Boolean}
	 * @parme :{[,String]}
	 * @todo  :判断字符串是否是数字
	 */
	window.String.prototype.isNumber=window.isNumber=function(str){
		return (/(^[1-9]\d+$)|(^\d$)/).test(str||this);
	};
	/**
	 * @return:{Array value}
	 * @todo  :随机取出数组中的一个值
	 */
	window.Array.prototype.random = function() {
		//“ >>0 ”向右移0位，作用同Math.floor(),向下取整，但性能更优
		return this[(window.Math.random()*this.length)>>0];
	};
	/**
	 * @return:{Array value}
	 * @todo  :取出数组中最大的一个数
	 */
	window.Array.prototype.max=function() {
		for(var i=0,max=this[0];i<this.length;i++){
			max=window.Math.max(max,this[i]);
		}
		return max;
	};
	/**
	 * @return:{Array value}
	 * @todo  :取出数组中最小的一个数
	 */
	window.Array.prototype.min = function() {
		for(var i = 0, min = this[0]; i < this.length; i++) {
			min = window.Math.min(min, this[i]);
		}
		return min;
	};
	/**
	 * @param :{Number,Number}
	 * @return:{Number:double}
	 * @todo  :随机生成一个介于start 和 end之间的数
	 */
	window.Math.randomRange=function (start,end) {
		return window.Math.random()*(start-end+1)+end;
	};
	/**
	 * @todo  :定义数组的enqueue(入队)方法
	 */
	window.Array.prototype.enqueue=window.Array.prototype.push;
	/**
	 * @todo  :定义数组的dequeue(出队)方法
	 */
	window.Array.prototype.dequeue=window.Array.prototype.shift;
	/**
	 * @type  :{Class}
	 * @todo  :定义一个Vector类
	 */
	window.Vector=window.Array;
	/**
	 * @param :{Point,Point}
	 * @return:{Number:double}
	 * @todo  :计算两点之间的距离
	 */
	window.Math.distance=function(point1,point2){
		var dx = point1.x - point2.x,
			dy = point2.y - point2.y;
		return window.Math.sqrt((dx * dx)+(dy * dy));
	};
	/**
	 * 队列
	 */
	window.Queue=window.Array;
}

