//  jsKid.js
//  jsKid
//  Created by qzm on 2012-12-30.
//  Copyright 2012 qzm. All rights reserved.

function jsKid() {
	//下面的$都代表jsKid
	var $=this,
		eventList=[];
	//拓展系统方法
	//类的继承 参考：Prototype JavaScript framework, version 1.7.1
	Object.extend = function(des, source) {
		for(var key in source) {
			des[key] = source[key];
		}
		return des;
	};
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
									window.mozRequestAnimationFrame    ||
									window.oRequestAnimationFrame      ||
									window.msRequestAnimationFrame     ||
									function(callback){ setTimeout (callback, 1000 / 60);};
	//cancelAnimationFrame
	window.cancelAnimationFrame =   window.cancelAnimationFrame        ||
									window.webkitCancelAnimationFrame  ||
									//火狐的mozRequestAnimationFrame 没有setTimeout稳定，抖动厉害
									window.mozCancelAnimationFrame     ||
									window.oCancelAnimationFrame       ||
									window.msCancelAnimationFrame      ||
									window.clearTimeout;
	//动画入口
	$.run = function(funtionToRun) {
		//循环体
		function worker() {
			funtionToRun();
			window.requestAnimationFrame(worker);
		}
		worker();
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
	//绑定事件
	//$.bind(window,['keydown','mousedown'],callback);
	$.bind=function(obj,events,callback){
		//正常浏览器兼容
		function callbackFn(evevt) {
			callback(event||window.event);
		}
		if(obj.addEventListener){
			if(typeof events==='string'){
				obj.addEventListener(events,callbackFn);
			}else if(typeof events==='object'){
				for(var i in events){
					obj.addEventListener(events[i],callbackFn);
				}
			}
		//IE兼容
		}else if(obj.attachEvent){
			if(typeof events==='string'){
				obj.attachEvent('on'+events,callbackFn);
			}else if(typeof events==='object'){
				for(var j in events){
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
			callbacks=[];
		for(var i in eventList){
			if(typeof eventList[i].events!=='undefined'){
				events=events.concat(eventList[i].events);
				callbacks=callbacks.concat(eventList[i].callback);
			}
		}
		for (var j = 0; j < events.length; j++) {
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
}

/////////////////////////////////////////////////////////////////////////////
								// 定义Notify
/////////////////////////////////////////////////////////////////////////////
function Notify($) {
	var notify=this;
	var map = [];
	var workerList = [];
	//注册notify
	notify.register = function (notifyName, notifyFunction) {
		var _notify = {
			name: notifyName,
			fun: notifyFunction
		};
		map.push(_notify);
	};
	//运行notify
	notify.notify = function (notifyName, notifyArgs) {
		for (var i in map) {
			if (map[i].name == notifyName) {
				workerList.push({
					notify: map[i].fun,
					name  : map[i].name,
					args  : notifyArgs
				});
				//同名的是否要执行？
				// break;
			}
		}
	};
	//多线程跑,加速,防阻塞
	$.run(function () {
		var worker = workerList.shift();
		if (worker) {
			worker.notify(worker.args);
		}
	});
	$.run(function () {
		var worker = workerList.shift();
		if (worker) {
			worker.notify(worker.args);
		}
	});
	$.run(function () {
		var worker = workerList.shift();
		if (worker) {
			worker.notify(worker.args);
		}
	});
}

