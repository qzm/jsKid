window.onload=function(){
/////////////////////////////////////////////////////////////////////////////
								// 定义Notify
/////////////////////////////////////////////////////////////////////////////
	function Notify($) {
		var notify=this;
		var map = [];
		var workerList = [];
		notify.register = function (notifyName, notifyFunction) {
			var _notify = {
				name: notifyName,
				fun: notifyFunction
			};
			map.push(_notify);
		};
		notify.unregister = function (notifyName) {
			for (var i in map) {
				if (map[i].name == notifyName) {
					delete map[i];
					// break;
				}
			}
		};
		notify.notify = function (notifyName, notifyArgs) {
			for (var i in map) {
				if (map[i].name == notifyName) {
					workerList.push({
						notify: map[i].fun,
						name  : map[i].name,
						args  : notifyArgs
					});
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
/////////////////////////////////////////////////////////////////////////////
								// 初始化数据
/////////////////////////////////////////////////////////////////////////////
	//初始化游戏核心库
	var $=new jsKid();
	//初始化数据
	$.context = $.Canvas.init();       //初始化Context
	$.canvas = $.Canvas.base();        //获取Canvas对象
	$.debug=true;                      //Debug模式(默认开启)，影响$.l()
	$.sprite=new Sprite($);            //精灵类
	$.notify = new Notify($);          //初始化Notify
	$.model=new Model($);              //初始化Model
	$.view = new View($);              //初始化View
	$.contraller = new Contraller($);  //初始化Contraller
	//设置Canvas，自适应大小
	$.canvas.height=window.innerHeight*0.97||1000;
	$.canvas.width =window.innerWidth*0.97||650;
	$.canvas.style.position='relative';

	//全局变量，方法
	var _zoom=0.8;
	gl={
		showInfo:function (startTime,x,y) {
			//显示动画帧数、刷新次数、数据变换次数
			var _ctx=$.context;
			_ctx.save();
			_ctx.fillStyle = 'red';
			_ctx.font = '18px 微软雅黑';
			var fen=window.requestAnimationFrame.toString().split(' ');
			if(fen[1].indexOf('callback')>=0){
				fen[1]='setTimeout()';
			}
			_ctx.fillText('动画函数:'+fen[1], 5, y);
			_ctx.fillText('FPS:' + Math.ceil(1000 / (new Date() - startTime + 1)), x, y);
			_ctx.restore();
			return this;
		},
		//坐标转换补偿
		tran:0,
		zoom:_zoom,
		top:$.canvas.height-700*_zoom,
		img:{
			wall:$.initImg('img/wall.png'),
			gress:$.initImg('img/gress.png'),
			humanRight:$.initImg('img/humanR.png'),
			humanLeft:$.initImg('img/humanL.png')
		},
		imgLength:0,
		imgReady:0
	};
	//等待图片资源加载完毕
	imgOnloadCallBack=function(){
		gl.imgReady++;
	};
	for(var img in gl.img){
		gl.imgLength++;
		gl.img[img].onload=imgOnloadCallBack;
	}
								// 注册Notify操作
/////////////////////////////////////////////////////////////////////////////
	//创建HumanAction 的MVC模式
	$.notify.register('creatHumanActionUI', function (args) {
		var _args = args || {
			data: null
		};
		$.model.humanActionCtrl = new $.contraller.HumanActionCtrl(new $.view.HumanActionView($.model.humanActionModel));
	});
/////////////////////////////////////////////////////////////////////////////
								// 调用Notify
/////////////////////////////////////////////////////////////////////////////
	var waitForImage=setInterval(function(){
		if(gl.imgReady==gl.imgLength){
			clearInterval(waitForImage);
			//创建MVC
			$.notify.notify('creatHumanActionUI');
			//测试用
			$.notify.notify('test');
		}
	},100);
};

//test

