function Sprite($){
	var sprite=this,_ctx=$.context;
	sprite.Human=function(args){
	var
		human=this,
		_args=Object.extend({
			tall:0,
			width:0,
			locationX:0,
			locationY:0
		},args),
		live=true;
		tall=_args.tall*gl.zoom,
		width=_args.width*gl.zoom,
		locationX=_args.locationX,
		locationY=_args.locationY,
		velocityValue=15*gl.zoom,
		velocityX = 0,
		velocityY = 0,
		velocityStartY=-40*gl.zoom,
		acceleration=3*gl.zoom,
		jumpLock=true,
		tranLock=true,
		tmpLocationY=locationY,
		contextStart=0,
		borderWidth=200,
		cube=(100*gl.zoom),
		faceTo='right',
		actionStep=0,
		lastTime=new Date(),
		timeout=133,
		anction={
			0:{sx:0,sy:0,sw:230,sh:200},
			1:{sx:230,sy:0,sw:230,sh:200},
			2:{sx:460,sy:0,sw:230,sh:200},
			3:{sx:690,sy:0,sw:230,sh:200},
			4:{sx:0,sy:200,sw:230,sh:200},
			5:{sx:230,sy:200,sw:230,sh:200},
			6:{sx:460,sy:200,sw:230,sh:200},
			7:{sx:690,sy:200,sw:230,sh:200}

		},
		moveFrame=[0,1,2,3,4,5,6,7];

		human.jump=function(){
			if(jumpLock){
				jumpLock=false;
				velocityY=velocityStartY;
			}
			return human;
		};
		human.move=function(face){
			if (face == 37||face == 65) {
				velocityX = -velocityValue;
				faceTo='left';
			} else if (face == 68||face == 39) {
				velocityX = velocityValue;
				faceTo='right';
			}
			tranLock=false;
			return human;
		};
		human.stop=function(){
			velocityX=0;
			tranLock=true;
			return human;
		};
		//human Left碰撞
		var impactLeft=function() {
			locationX-=velocityX;
			locationX-=velocityX;
			velocityX=0;
			// console.log('Left');
		};
		//human Right碰撞
		var impactRight=function() {
			locationX-=velocityX;
			velocityX=0;
			// console.log('Right');
		};
		//human Top碰撞
		var impactTop=function() {
			locationY-=velocityY;
			velocityY=0;
			// console.log('Top');
		};
		//human Foot碰撞
		var impactFoot=function() {
			locationY-=velocityY;
			// locationY-=velocityY;
			velocityY=0;
			jumpLock=true;
		};
		var checkImpact=function(){
			var hLeft=locationX-width/2,     //人的左上角x坐标值
				hTop=locationY-tall/2,      //人的左上角y坐标值
				hRight=locationX+width/2, //人的右下角x坐标值
				hBottom=locationY+tall/2,  //人的右下角y坐标值

				cLeft,              //方块的左上角x坐标值
				cTop,              //方块的左上角y坐标值
				cRight,          //方块的右下角x坐标值
				cBottom,          //方块的右下角y坐标值
				_width=(100*gl.zoom),      //方块的宽度
				_height=(100*gl.zoom);     //方块的高度

			//遍历地图
			for (var i = 0; i < map[0].length; i++) {
				for (var j = 0; j < map.length; j++) {
					//屏幕外的就不计算了
					if((i+1)*_width>=gl.tran&&i*_width<=gl.tran+$.canvas.width){
						cLeft=i*_width-gl.tran;              //方块的左上角x坐标值
						cTop=_height*j+gl.top;              //方块的左上角y坐标值
						cRight=i*_width-gl.tran+_width;   //方块的右下角x坐标值
						cBottom=_height*j+gl.top+_height;  //方块的右下角y坐标值
						//实心的物体
						if(map[j][i]>=0){
							//方块在人的右边
							if(cLeft < hRight&&cLeft>hLeft&&cTop<hBottom&&cBottom>hTop){
								impactRight();
							}
							//方块在人的上面
							if(cBottom > hTop&&cBottom<hBottom&&cRight>hLeft&&cLeft<hRight){
								impactTop();
							}
							//方块在人的下面
							if(cTop < hBottom+10&&cTop>hTop&&cRight>hLeft&&cLeft<hRight){
								impactFoot();
							}
							//方块在人的左边
							if(cRight > hLeft&&cRight<hRight&&cTop<hBottom&&cBottom>hTop){
								impactLeft();
							}
							//左边边界
							if(locationX-width/2<0){
								impactLeft();
							}
							//右边边界
							if(locationX-gl.tran+width/2>$.canvas.width){
								impactRight();
							}

						}

					}
				}
			}

		};
		human.border=function(){
			return {top:top,right:right,foot:foot,left:left};
		};
		var deah=function() {
			if(locationY>=$.canvas.height&&live) {
				notify.notify('alert', {msg:'~~ Game Over ~~'});
				live=false;
			}
		};
		var win=function() {
			if((locationX+gl.tran>=100*gl.zoom*(map[0].length-5))&&live) {
				notify.notify('alert', {msg:'~~ You Win ~~'});
				live=false;
			}
		};
		human.refresh=function(){
			locationX+=velocityX;
			locationY+=velocityY;
			gl.tran=human.contextStart();
			checkImpact();
			velocityY+=acceleration;
			deah();
			win();
			if(!tranLock){
				if(locationX+borderWidth>=$.canvas.width){
					//画布左移 人物往右边边走
					if(contextStart+locationX+borderWidth<=(map[0].length)*(100*gl.zoom)){
						contextStart+=velocityX;
						if(contextStart+locationX>=(map[0].length)*(100*gl.zoom)){
							contextStart=(map[0].length)*(100*gl.zoom)-locationX-borderWidth;
						}
						locationX-=velocityX;
					}
				}
			}
			if(!tranLock){
				if(locationX-borderWidth<=0){
					//画布右移 人物往左边走
					if(contextStart){
						contextStart+=velocityX;
						if(contextStart<=0){
							contextStart=0;
						}
						locationX-=velocityX;
					}
				}
			}

			return human;
		};
		human.contextStart=function(){
			return contextStart;
		};
		human.draw=function(){
			var _human=anction[moveFrame[actionStep]];
			_ctx.save();
			_ctx.beginPath();
			// _ctx.rect(locationX-width/2, locationY-tall/2, width, tall);
			// _ctx.stroke();

			if(faceTo=='right'){
				_ctx.drawImage(gl.img.humanRight,_human.sx,_human.sy,_human.sw,_human.sh,locationX-5*width/3, locationY-tall, _human.sw*gl.zoom*3/4, _human.sh*gl.zoom*3/4);
			}else{
				_ctx.drawImage(gl.img.humanLeft,_human.sx,_human.sy,_human.sw,_human.sh,locationX-5*width/3, locationY-tall, _human.sw*gl.zoom*3/4, _human.sh*gl.zoom*3/4);
			}
			var thisTime=new Date();
			if(thisTime-lastTime>timeout){
				lastTime=thisTime;
				actionStep++;
			}
			if(actionStep==moveFrame.length){
				actionStep=0;
			}
			_ctx.closePath();
			_ctx.restore();
			return human;
		};
	};
	sprite.World=function(map){
		var world=this,
			_width=(100*gl.zoom);
		world.draw=function(){
			_ctx.save();
			//i 列 j 行
			for (var i = 0; i < map[0].length; i++) {
				for (var j = 0; j < map.length; j++) {
					//屏幕外的就不画了
					if((i+1)*_width>=gl.tran&&i*_width<=gl.tran+$.canvas.width){
						switch(map[j][i]){
							case -1:
								// world.drawAir(map[i][j]);
								break;
							case 0:
								// world.drawHuman(map[i][j]);
								break;
							case 1:
								new sprite.Gress().draw(i,j);
								break;
							case 2:
								new sprite.Wall().draw(i,j);
								break;
							case -3:
								new sprite.Water().draw(i,j);
								break;
							case 3:
								new sprite.Firewall().draw(i,j);
								break;
							case -4:
								new sprite.Fire().draw(i,j);
								break;
							default:
								// world.drawAir(map[i][j]);
						}
					}
				}
			}
			_ctx.restore();
		};
	};
	sprite.Gress=function(){
		var gress=this,
			width=(100*gl.zoom),
			height=(100*gl.zoom),
			gressStyle='green';
		gress.draw=function(i,j){
			_ctx.save();
			_ctx.beginPath();
			_ctx.drawImage(gl.img.floor,0,0,100,100,i*width-gl.tran, height*j+gl.top,width, height);
			// _ctx.rect(i*width-gl.tran, height*j+gl.top,width, height);
			// _ctx.stroke();
			_ctx.beginPath();
			_ctx.restore();
		};
	};
	sprite.Wall=function(){
		var wall=this,
			width=(100*gl.zoom),
			height=(100*gl.zoom);
		wall.draw=function(i,j){
			_ctx.save();
			_ctx.beginPath();
			_ctx.drawImage(gl.img.floor,100,0,100,100,i*width-gl.tran, height*j+gl.top,width, height);
			// _ctx.rect(i*width-gl.tran, height*j+gl.top,width, height);
			// _ctx.stroke();
			_ctx.beginPath();
			_ctx.restore();
		};
	};
	sprite.Fire=function(){
		var wall=this,
			width=(100*gl.zoom),
			height=(100*gl.zoom);
		wall.draw=function(i,j){
			_ctx.save();
			_ctx.beginPath();
			_ctx.globalAlpha=0.1;
			_ctx.drawImage(gl.img.floor,100,0,100,100,i*width-gl.tran, height*j+gl.top,width, height);
			_ctx.beginPath();
			_ctx.restore();
		};
	};
	sprite.Firewall=function(){
		var wall=this,
			width=(100*gl.zoom),
			height=(100*gl.zoom);
		wall.draw=function(i,j){
			_ctx.save();
			_ctx.beginPath();
			_ctx.globalAlpha=0.5;
			_ctx.drawImage(gl.img.floor,100,0,100,100,i*width-gl.tran, height*j+gl.top,width, height);
			_ctx.beginPath();
			_ctx.restore();
		};
	};
	sprite.Water=function(){
		var water=this,
			width=(100*gl.zoom),
			height=(100*gl.zoom),
			waterStyle='rgb(0,128,192)';
		water.draw=function(i,j){
			_ctx.save();
			_ctx.beginPath();
			_ctx.rect(i*width-gl.tran, height*j+gl.top, width, height);
			_ctx.fillStyle = waterStyle;
			_ctx.fill();
			_ctx.beginPath();
			_ctx.restore();
		};
	};
	sprite.Logo=function(){
		var background=this,
			width=500,
			height=437,
			img=gl.img.logo;
		background.draw=function() {
			_ctx.save();
			_ctx.beginPath();
			// _ctx.globalAlpha=0.7;
			_ctx.drawImage(img,0,0,width,height,0,0,width/5, height/5);
			_ctx.closePath();
			_ctx.restore();
		};
	};
}
