function View($) {
	//初始化Demo4中球的位置，颜色，数量
	this.demo4View = function (model) {
		this.model = model;
		var balls=[],ball;
		var color=['orangered','red','skyblue','blue','yellowgreen','green','yellow','pink','orange','lightblue','lightgreen','gold','orchid','fuchsia','silver','teal'];
		for(var i=0;i<Math.ceil((window.innerWidth+window.innerHeight)/3);i++){
			ball=new $.sprite.Ball(Math.ceil(Math.random()*($.canvas.width-60)+30), Math.ceil(Math.random()*($.canvas.height-60)+30), 20+10*(i%5), color[i%color.length]);
			ball.setEnvironment((Math.random()*8-4),(Math.random()*8-4),0, 0, $.canvas.width, $.canvas.height);
			balls.push(ball);
		}
		this.model.balls=balls;
	};
	return this;
}