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
	$.im=new Im($);                    //初始化IM
	//设置Canvas，自适应大小
	$.canvas.height=window.innerHeight*0.97||1000;
	$.canvas.width =window.innerWidth*0.97||650;
	$.canvas.style.position='relative';

	//全局变量，方法
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
		}
	};

/////////////////////////////////////////////////////////////////////////////
								// 注册Notify操作
/////////////////////////////////////////////////////////////////////////////
	//创建Demo4 的MVC模式
	$.notify.register('creatDemo4UI', function (args) {
		var _args = args || {
			data: null
		};
		$.model.demo4Ctrl = new $.contraller.demo4Ctrl(new $.view.demo4View($.model.demo4Model));
	});
	//设置Demo4 的视图
	$.notify.register('setBallView', function (args) {
		var _model=$.model.demo4Model;
		var startTime=new Date();
		$.context.clearRect(0,0,$.canvas.width,$.canvas.height);
		for(var i=0;i<_model.balls.length;i++){
			_model.balls[i].move();
			_model.balls[i].draw();
		}
		if($.debug){
			gl.showInfo(startTime,$.canvas.width-80,20);
		}
	});
	// callAlert
	$.notify.register('callAlert', function (args) {
		// alert(args);
		$.l(args);
	});
/////////////////////////////////////////////////////////////////////////////
								// 调用Notify
/////////////////////////////////////////////////////////////////////////////
	//创建MVC
	$.notify.notify('creatDemo4UI');
	$.notify.unregister('unregister');
};
