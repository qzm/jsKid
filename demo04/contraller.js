function Contraller($) {
	var contraller=this;
	contraller.demo4Ctrl = function (view) {
		var _ctrl = this,
			_view = view,
			_model = view.model,
			_ctx = gl.ctx;
		$.bind($.canvas,'click',function (evevt){
			var color=['orangered','red','skyblue','blue','yellowgreen','green','yellow','pink','orange','lightblue','lightgreen','gold','orchid','fuchsia','silver','teal'];
			var ball=new $.sprite.Ball(
				event.clientX,
				event.clientY,
				[30,40,50,60].random(),
				color.random()
			);
			ball.setEnvironment(Math.randomRange(-4,4),Math.randomRange(-4,4),0, 0, $.canvasWidth, $.canvasHeight);
			_model.balls.push(ball);
			$.l('balls:'+_model.balls.length);
		});
		//动画循环
		$.run(function () {
			//绘制视图
			$.context.clearRect(0,0,$.canvasWidth,$.canvasHeight);
			notify.notify('setBallView');

		});
	};
	return this;
}