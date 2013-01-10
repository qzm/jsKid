//控制器
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
				[30,40,50,60,70].random(),
				color.random()
			);
			ball.setEnvironment(Math.randomRange(-4,4),Math.randomRange(-4,4),0, 0, $.canvasWidth, $.canvasHeight);
			_model.balls.push(ball);
			$.l('balls:'+_model.balls.length);
		});
		//动画循环
		$.bind(window,'keydown',function (event){
			//按下减号
			if(event.keyCode===189){
				_model.balls.shift();
			//按下加号
			}else if(event.keyCode===187){
				$.setEvent('click');
			}
		});
		$.run(function () {
			//绘制视图
			$.context.clearRect(0,0,$.canvasWidth,$.canvasHeight);
			notify.notify('setBallView');
		});
	};
	return this;
}