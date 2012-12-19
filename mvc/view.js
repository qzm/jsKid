function View($) {
	sprite=new Sprite($);
	this.demo4View = function (model) {
		this.model = model;
		var balls=[];
		var color=['orangered','red','skyblue','blue','yellowgreen','green','yellow','pink','orange','lightblue','lightgreen','gold','orchid','fuchsia','silver','teal'];
		for(var i=0;i<100;i++){
			var ball=new sprite.Ball(Math.ceil(Math.random()*(gl.canvas.width-60)+30), Math.ceil(Math.random()*(gl.canvas.height-60)+30), 20+10*(i%5), color[i%color.length]);
			balls.push(ball);
		}
		this.model.balls=balls;
	};
}