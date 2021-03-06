function Contraller($) {
	var contraller=this;
	contraller.HumanActionCtrl = function (view) {
		var _ctrl = this;
		var _view = view;
		var _model = view.model;
		var human=_model.human;
		var world=_model.world;
		var logo=_model.logo;
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
				case 80:     //‘P’键
					$.playPause();
					break;
			}

		});

		$.bind(window,'mousedown',function(event){
			if(event.clientX>$.canvasWidth*3/4){
				human.move(39);
			}else if(event.clientX<$.canvasWidth*1/4){
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
		var _width=$.canvasWidth/10,_height=$.canvasHeight/20;
		// var counter=0;
		$.run(function(){
			startTime=new Date();
			//每隔10秒摧毁一次Canvas画布，防止路径未闭合
			// if(counter>=600){
				// $.canvas.width=$.canvasWidth;
				// counter=0;
			// }else{
				// ctx.clearRect(0,0,$.canvasWidth,$.canvasHeight);
				// counter++;
			// }
			ctx.clearRect(0,0,$.canvasWidth,$.canvasHeight);
			//画各种元素
			logo.draw();
			world.draw();
			human.refresh();
			human.draw();
			if($.debug){
				notify.notify('showInfo', {startTime:startTime,x:$.canvasWidth-80,y:20});
			}
		});
	};
	return this;
}