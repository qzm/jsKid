function Contraller($) {
	var contraller=this;
	contraller.HumanActionCtrl = function (view) {
		var _ctrl = this;
		var _view = view;
		var _model = view.model;
		var human=_model.human;
		var world=_model.world;
		window.addEventListener('keydown',function(event){
			switch(event.keyCode){
				case 37:     //‘←’键
				case 65:     //‘A’键
				case 68:     //‘D’键
				case 39:     //‘→’键
					human.move(event.keyCode);
					break;
				case 38:     //‘↑’键
				case 87:     //‘W’键
					// human.jump();
					break;
			}
		});
		window.addEventListener('keyup',function(event){
			human.stop();
		});
		//动画循环
		var startTime,ctx=$.context;
		var _width=$.canvas.width/10,_height=$.canvas.height/20;
		$.run(function(){
			startTime=new Date();
			gl.tran=human.contextStart();
			ctx.clearRect(0,0,$.canvas.width,$.canvas.height);
			world.draw();
			human.refresh();
			human.draw();
			ctx.save();
			ctx.beginPath();
			ctx.font = '100px 微软雅黑';
			ctx.fillStyle='red';
			ctx.globalAlpha='0.2';
			ctx.fillText('未完待续',$.canvas.width/2-200,150);
			ctx.closePath();
			ctx.restore();
			gl.showInfo(startTime,$.canvas.width-80,20);
		});

	};
	return this;
}