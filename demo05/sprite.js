function Sprite($){
	var sprite=this,_ctx=$.context,
		enumWallType={
			air     : -1,
			fire    : -4,
			firewall:  3,
			gress   :  1,
			wall    :  2,
			water   : -3,
			zhanwei :  0
		};
	sprite.Human=function(args){
	var
		human=this,                 //指针
		_args=Object.extend({       //继承参数
			tall:0,                 //身高
			width:0,                //横向宽度
			locationX:0,            //位置X
			locationY:0             //位置Y
		},args),
		gameZoom=gl.zoom;
		live=true;                  //是否活着
		tall=_args.tall*gameZoom,    //身高
		width=_args.width*gameZoom,  //横向宽度
		locationX=_args.locationX,  //位置X
		locationY=_args.locationY,  //位置Y
		velocityValue=15*gameZoom,   //横向移动的【速率】
		velocityX = 0,              //X轴速度
		velocityY = 0,              //Y轴速度
		velocityStartY=-40*gameZoom, //起跳的速度
		acceleration=3*gameZoom,     //重力加速度
		jumpLock=true,              //跳跃锁，锁定时，无法跳跃
		tranLock=true,              //滚动屏幕锁，锁定时，屏幕无法滚动
		contextStart=0,             //人离最左边地图的偏移位置
		borderWidth=200,            //距离屏幕两边的距离，小于则屏幕滚动
		cube=(100*gameZoom),         //方块的大小
		faceTo='right',             //人脸朝向
		actionStep=0,               //人物动作的步骤数目，画到第几帧了
		lastTime=new Date(),        //上一次画人物的时间
		timeout=133,                //人物动作每帧之间的时间间隔
		anction={                   //人物每帧动作的切图位置
			0:{sx:0,sy:0,sw:230,sh:200},
			1:{sx:230,sy:0,sw:230,sh:200},
			2:{sx:460,sy:0,sw:230,sh:200},
			3:{sx:690,sy:0,sw:230,sh:200},
			4:{sx:0,sy:200,sw:230,sh:200},
			5:{sx:230,sy:200,sw:230,sh:200},
			6:{sx:460,sy:200,sw:230,sh:200},
			7:{sx:690,sy:200,sw:230,sh:200}

		},
		moveFrame=[0,1,2,3,4,5,6,7],//人物静止状态的动作帧
		// jumpFrame=[8,9,10,11,...]//人物跳跃时的动作帧数
		//人物跳跃
		human.jump=function(){
			if(!jumpLock){                       //判断是否可以跳跃
				jumpLock=true;                   //解开锁定
				velocityY=velocityStartY;        //给予Y轴初速度
			}
			return human;
		};
		//人物移动
		human.move=function(face){
			if (face == 37||face == 65) {        //A键或<-键
				velocityX = -velocityValue;      //X轴速度取反
				faceTo='left';                   //人脸朝向变成左边
			} else if (face == 68||face == 39) { //D键或->键
				velocityX = velocityValue;       //X轴速度取反
				faceTo='right';                  //人脸朝向变成右边
			}
			tranLock=false;                      //解锁屏幕滚动，让屏幕可以滚动
		};
		//人物静止
		human.stop=function(){
			velocityX=0;                         //松开按键的时候，人物静止，速度0
			tranLock=true;                       //锁定滚屏
		};
		//human Left碰撞
		function impactLeft() {
			locationX-=velocityX;
			velocityX=0;
		}
		//human Right碰撞
		function impactRight() {
			locationX-=velocityX;
			velocityX=0;
		}
		//human Top碰撞
		function impactTop() {
			locationY-=velocityY;
			velocityY=0;
		}
		//human Foot碰撞
		function impactFoot() {
			locationY-=velocityY;
			velocityY=0;
			jumpLock=false;                  //人物碰到地面，可以跳跃，解锁跳跃
		}
		function checkImpact(){
			var hLeft=locationX-width/2,     //人的左上角x坐标值
				hTop=locationY-tall/2,       //人的左上角y坐标值
				hRight=locationX+width/2,    //人的右下角x坐标值
				hBottom=locationY+tall/2,    //人的右下角y坐标值

				cLeft,                       //方块的左上角x坐标值
				cTop,                        //方块的左上角y坐标值
				cRight,                      //方块的右下角x坐标值
				cBottom,                     //方块的右下角y坐标值
				_width=(100*gameZoom),        //方块的宽度
				_height=(100*gameZoom);       //方块的高度

			//遍历地图
			var humanLocationX=gl.tran+locationX;            //人物的偏移位置
			for (var i = 0; i < map[0].length; i++) {
				for (var j = 0; j < map.length; j++) {
					//距离超过200的就不计算了
					if((i+1)*_width>=(humanLocationX-200)&&i*_width<=(humanLocationX+200)){
						cLeft=i*_width-gl.tran;              //方块的左上角x坐标值
						cTop=_height*j+gl.top;               //方块的左上角y坐标值
						cRight=i*_width-gl.tran+_width;      //方块的右下角x坐标值
						cBottom=_height*j+gl.top+_height;    //方块的右下角y坐标值
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
							if(locationX-gl.tran+width/2>$.canvasWidth){
								impactRight();
							}

						}

					}
				}
			}

		}
		//检查人物是否死亡
		function deah() {
			if(locationY>=$.canvasHeight&&live) {
				notify.notify('alert', {msg:'~~ Game Over ~~'});
				live=false;
				window.location=window.location;
			}
		}
		//检查游戏是否胜利
		function win() {
			if((locationX+gl.tran>=100*gameZoom*(map[0].length-5))&&live) {
				// notify.notify('alert', {msg:'~~ You Win ~~'});
				alert('~~ You Win ~~');
				live=false;
				window.location=window.location;
			}
		}
		//偏移位置
		function tran(){
			return contextStart;
		}
		//刷新人物数据
		human.refresh=function(){
			locationX+=velocityX;            //X轴运动
			locationY+=velocityY;            //Y轴运动
			gl.tran=tran();                  //设置全局变量，偏移位置
			checkImpact();                   //检查是否碰撞
			velocityY+=acceleration;         //重力加速度作用
			deah();                          //检查人物是否死亡
			win();                           //胜利条件判断
			if(!tranLock){
				if(locationX+borderWidth>=$.canvasWidth){
					//画布左移 人物往右边边走
					if(contextStart+locationX+borderWidth<=(map[0].length)*(100*gameZoom)){
						contextStart+=velocityX;
						if(contextStart+locationX>=(map[0].length)*(100*gameZoom)){
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
					if((i+1)*_width>=gl.tran&&i*_width<=gl.tran+$.canvasWidth){
						switch(map[j][i]){
							case enumWallType.gress:
								new sprite.Gress().draw(i,j);
								break;
							case enumWallType.wall:
								new sprite.Wall().draw(i,j);
								break;
							case enumWallType.water:
								new sprite.Water().draw(i,j);
								break;
							case enumWallType.firewall:
								new sprite.Firewall().draw(i,j);
								break;
							case enumWallType.fire:
								new sprite.Fire().draw(i,j);
								break;
							case enumWallType.air:
							case enumWallType.zhanwei:
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
