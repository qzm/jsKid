function View($) {
	//初始化Demo4中球的位置，颜色，数量
	this.demo4View = function(model) {
		this.model = model;
		var balls = [],
			ball,
		color = ['orangered', 'red', 'skyblue', 'blue', 'yellowgreen', 'green', 'yellow', 'pink', 'orange', 'lightblue', 'lightgreen', 'gold', 'orchid', 'fuchsia', 'silver', 'teal'];
		for(var i = 0; i < Math.ceil((window.innerWidth + window.innerHeight) / 20); i++) {
			ball = new $.sprite.Ball(
				Math.ceil(Math.randomRange(30, $.canvasWidth - 30)),   //X轴坐标
				Math.ceil(Math.randomRange(30, $.canvasHeight - 30)),  //y轴坐标
				[30, 40, 50, 60].random(),                              //随机大小
				color.random()                                          //随机颜色
			);
			ball.setEnvironment(Math.randomRange(-4,4),Math.randomRange(-4,4), 0, 0, $.canvasWidth, $.canvasHeight);
			balls.push(ball);
		}
		this.model.balls = balls;
	};
	return this;
}