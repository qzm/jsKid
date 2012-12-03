function jsKid() {
	//初始化资源
	this.version = {
		info: '命名为jsKid，是觉得这个核心库很不成熟，希望它能想一个孩子一样茁壮成长。',
		name: 'jsKid',
		version: '1.0',
		author: 'QZM',
		eMail: 'q.hn@163.com'
	},
	//IE标示
	this.browser = true,
	//初始化，以函数作为参数
	this.init = function (args) {
		gl = new global();
		args.call();
	},
	//内存缓存
	this.Cache = {
		map: [],
		//设置缓存
		set: function (key, value) {
			this.map[key] = value;
		},
		//获得缓存
		get: function (key) {
			return this.map[key];
		},
		//判断时候存在缓存
		havekey: function (key) {
			if (this.get(key)) {
				return false;
			} else {
				return true;
			}
		},
		//移除缓存
		remove: function (key) {
			delete this.map[key];
		},
		//缓存自增 类似于 i++
		plus: function (key, step) {
			return this.map[key] += step;
		}
	},
	//本地存储
	this.Storage = {
		//设置
		set: function (key, value) {
			window.localStorage[key] = value;
		},
		//获得键值
		get: function (key) {
			return window.localStorage[key];
		},
		//判断时候有键值
		havekey: function (key) {
			if (window.localStorage[key]) return true;
			return false;
		},
		//删除键值
		remove: function (key) {
			window.localStorage.removeItem(key);
		},
		//获取值所对应的键(开销较大,慎用)
		getKey: function (value) {
			for (var i = 0; i < window.localStorage; i++) {
				if (window.localStorage[i] == value) return window.localStorage.key(i);
			}
			return null;
		},
		//摧毁整个LocalStorage
		clear: function () {
			window.localStorage.clear();
		},
		//判断值是否相等
		equal: function (key1, key2) {
			if (window.localStorage[key1] == window.localStorage[key2]) return true;
			return false;
		},
		//判断值、类型是否相等
		aEqual: function (key1, key2) {
			if (window.localStorage[key1] === window.localStorage[key2]) return true;
			return false;
		},
		//原型，用于其他未封装的方法
		prototype: window.localStorage
	},
	//动画入口
	this.run = function (funtionToRun) {
		//循环体
		//重写requestAnimationFrame
		window.requestAnimationFrame = (function () {
			return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){window.setTimeout(callback,1000/60);};
		})();
		//重写cancelAnimationFrame
		window.cancelAnimationFrame = (function () {
			return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || window.clearTimeout;
		})();
		console.log('requestAnimationFrame Type:'+requestAnimationFrame);
		(function _worker(){
			funtionToRun.call();
			requestAnimationFrame(_worker);
		})();
	},
	//Canvas 相关
	this.Canvas = {
		//初始化
		init: function () {
			var _c = document.getElementsByTagName('canvas')[0];
			return _c.getContext("2d");
		},base:function(){
			return document.getElementsByTagName('canvas')[0];
		}
	},
	//日志封装/仅为了减少调试时的打字量
	this.log = this.l = function (args) {
		console.log(args);
	}, this.error = function (args) {
		console.error(args);
	},
	//document 选择封装
	this.Dom = function (args) {
		if (args[0]) {
			switch (args[0]) {
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
	},
	//时间封装
	this.t = function () {
		function getBase() {
			return this.base;
		}
		this.base = Date;
		this.aha = function () {
			alert('aha');
		}, this.now = function () {
			return (new Date()).toTimeString();
		}, this.today = function () {
			return (new Date()).toDateString();
		}, this.sec = function () {
			return (new Date()).getSecond();
		};
	};
}
