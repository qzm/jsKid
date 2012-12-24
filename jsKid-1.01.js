(function jsKid() {
	var $={};
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
	//拓展系统方法
	//将字符串转换成int类型
	window.String.prototype.toInt = function() {
		return window.parseInt(this);
	};
	
	//将字符串转化成数组
	window.String.prototype.toArray = window.parseArray = function(str) {
		return Array.prototype.slice.call(str || this);
	};
	//判断字符串是否是邮件
	window.String.prototype.isEmail = window.isEmail = function(str) {
		return(/^[\w_\.]+@[\w_\.]+\.[a-zA-Z]+$/).test(str || this);
	};
	//判断字符串是否是手机号码
	window.String.prototype.isMobile = window.isMobile = function(str) {
		return(/^1[358]\d{9}$/).test(str || this);
	};
	//判断字符串是否是身份证号码
	window.String.prototype.isIdCard = window.isIdCard = function(str) {
		return(/^(\d{15})$|^(\d{17}[\d\*]$)/).test(str || this);
	};
	window.String.prototype.isNumber = window.isNumber = function(str) {
		return(/^[1-9]\d+$/).test(str || this);
	};
	//随机取出数组中的一个值
	window.Array.prototype.random = function() {
		return this[window.Math.floor(Math.random() * this.length)];
	};
	//取出数组中最大的一个数
	window.Array.prototype.max = function() {
		for(var i = 0, _max = this[0]; i < this.length; i++) {
			_max = Math.max(_max, this[i]);
		}
		return _max;
	};
	//取出数组中最小的一个数
	window.Array.prototype.min = function() {
		for(var i = 0, _min = this[0]; i < this.length; i++) {
			_min = Math.min(_min, this[i]);
		}
		return _min;
	};
	//出队入队操作
	window.Array.prototype.enqueue = window.Array.prototype.push;
	window.Array.prototype.dequeue = window.Array.prototype.shift;
	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||function(callback) {setTimeout(callback, 1000 / 60); };
	//cancelAnimationFrame
	window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || window.clearTimeout;
	//动画入口



})();

(function test(){

})();