function Contraller($) {
	var contraller=this;
	contraller.HumanActionCtrl = function (view) {
		var _ctrl = this;
		var _view = view;
		var _model = view.model;
		var human=_model.human;
		var world=_model.world;
		window.addEventListener('keydown',function(event){
			// console.log(event.keyCode);
			switch(event.keyCode){
				case 37:     //‘←’键
				case 65:     //‘A’键
				case 68:     //‘D’键
				case 39:     //‘→’键
					human.move(event.keyCode);
					break;
				case 38:     //‘↑’键
				case 87:     //‘W’键
					human.jump();
					break;
			}
		});
		window.addEventListener('keyup',function(event){
			human.stop();
		});
		//动画循环
		var startTime;
		var _width=$.canvas.width/10,_height=$.canvas.height/20;
		$.run(function(){
			var startTime=new Date();
			gl.tran=human.contextStart();
			$.context.clearRect(0,0,$.canvas.width,$.canvas.height);
			world.draw();
			gl.showInfo(startTime,$.canvas.width-80,20);
			human.refresh();
			human.draw();
		});

	};
	return this;
}