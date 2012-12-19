function Notify($) {
	var map = [];
	var workerList = [];
	this.register = function (notifyName, notifyFunction) {
		var _notify = {
			name: notifyName,
			fun: notifyFunction
		};
		map.push(_notify);
	};
	this.notify = function (notifyName, notifyArgs) {
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
gl={
	showInfo:function (startTime,x,y) {
		//显示动画帧数、刷新次数、数据变换次数
		_ctx.save();
		_ctx.fillStyle = 'red';
		_ctx.font = '18px 微软雅黑';
		// var fen=window.requestAnimationFrame.toString().split(' ');
		// fen[1]=fen[1].replace('()','');
		// _ctx.fillText('动画函数:'+fen[1], 5, y);
		// _ctx.fillText('FPS:' + Math.ceil(1000 / (new Date() - startTime + 1)), x, y);
		_ctx.restore();
		return this;
	},stratTime:null
};
window.onload=function(){
	gl.ctx = $.Canvas.init();
	gl.canvas = $.Canvas.base();
	gl.canvas.height=window.innerHeight*0.97||1000;
	gl.canvas.width =window.innerWidth*0.97||650;
	gl.canvas.style.position='relative';
};
$ = new jsKid();
notify = new Notify($);
im=new Im($);
view = new View($);
contraler = new Contraler($);

/////////////////////////////////////////////////////////////////////////////
								// 定义Notify
/////////////////////////////////////////////////////////////////////////////
//demo4
notify.register('creatDemo4UI', function (args) {
	_args = args || {
		data: null
	};
	model.demo4Ctrl = new contraler.demo4Ctrl(new view.demo4View(model.demo4Model));
	// model.demo4Ctrl.update().refresh();
});

notify.register('setBallView', function (args) {
	_model=model.demo4Model;
	for (var i = 0; i < _model.balls.length; i++) {
		_model.balls[i].setEnvironment((Math.random()*8-4),(Math.random()*8-4),0, 0, gl.canvas.width, gl.canvas.height);
	}
	_model=model.demo4Model;
	$.run(function ($) {
		var startTime=new Date();
		// gl.canvas.width=gl.width;
		gl.ctx.clearRect(0,0,gl.canvas.width,gl.canvas.height);
		for(var i=0;i<_model.balls.length;i++){
			_model.balls[i].move();
			_model.balls[i].draw();
		}
		gl.showInfo(startTime,gl.canvas.width-80,20);
	});
});

/////////////////////////////////////////////////////////////////////////////
								// 调用Notify
/////////////////////////////////////////////////////////////////////////////

notify.notify('creatDemo4UI');
notify.notify('setBallView');

