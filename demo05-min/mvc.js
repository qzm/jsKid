function Model($){
	var model;
	model={
		humanActionCtrl:null,			//demo4 的控制器
		humanActionModel:{
			human:null,
			world:null,
			logo:null
		}
	};
	return model;
}

function View($) {
	this.HumanActionView = function (model) {
		this.model = model;
		this.model.human=new $.sprite.Human({tall:60,width:60,locationX:300*gl.zoom,locationY:$.canvasHeight-(300)*gl.zoom});
		this.model.world=new $.sprite.World(map);
		this.model.logo=new $.sprite.Logo();
	};
	return this;
}

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
		$.run(function(){
			startTime=new Date();
			ctx.clearRect(0,0,$.canvasWidth,$.canvasHeight);
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