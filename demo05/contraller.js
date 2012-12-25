function Contraller($) {
	var contraller=this;
	contraller.HumanActionCtrl = function (view) {
		var _ctrl = this;
		var _view = view;
		var _model = view.model;
		var human=_model.human;
		var world=_model.world;
		$.bind(window,'keydown',function(event){
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
		$.bind(window,'mousedown',function(event){
			if(event.clientX>$.canvas.width*3/4){
				human.move(39);
			}else if(event.clientX<$.canvas.width*1/4){
				human.move(37);
			}else{
				human.stop();
			}
			event=null;
		});

		$.bind(window,['mouseup','keyup'],function(){
			human.stop();
		});
		$.setEvent('mouseup');
		//动画循环
		var startTime,ctx=$.context;
		var _width=$.canvas.width/10,_height=$.canvas.height/20;
		$.run(function(){
			startTime=new Date();
			ctx.clearRect(0,0,$.canvas.width,$.canvas.height);
			world.draw();
			human.refresh();
			human.draw();
			if($.debug){
				// notify.notify('showDebugInfo', {msg: gl.lang.weiwandaixu, x:$.canvas.width/2-200, y:150});
				notify.notify('showInfo', {startTime:startTime,x:$.canvas.width-80,y:20});
			}
		});

	};
	return this;
}