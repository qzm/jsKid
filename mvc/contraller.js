function Contraller($) {
	contraller=this;
	contraller.demo4Ctrl = function (view) {
		var _ctrl = this;
		var _view = view;
		var _model = view.model;
		var _ctx = gl.ctx;
		//绑定click事件，创建新的球
		$.canvas.addEventListener('click', function (event) {
			var color=['orangered','red','skyblue','blue','yellowgreen','green','yellow','pink','orange','lightblue','lightgreen','gold','orchid','fuchsia','silver','teal'];
			var ball=new sprite.Ball(event.clientX, event.clientY, 20+10*(Math.random()*10%5), color[Math.ceil(Math.random()*color.length-1)]);
			ball.setEnvironment((Math.random()*8-4),(Math.random()*8-4),0, 0, $.canvas.width, $.canvas.height);
			_model.balls.push(ball);
			$.l('balls:'+_model.balls.length);
		});
		//动画循环
		$.run(function () {
			//绘制视图
			$.notify.notify('setBallView');
		});
	};
}