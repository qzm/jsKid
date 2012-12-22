function Sprite($){
	var sprite=this;
	sprite.Human=function(args){
	var
		human=this,
		_args=args||{
			tall:0,
			width:0,
			locationX:0,
			locationY:0

		},
		tall=_args.tall*gl.zoom||0,
		width=_args.width*gl.zoom||0,
		locationX=_args.locationX||0,
		locationY=_args.locationY||0,
		top=(locationY+tall/2)||0,
		foot=(locationY-tall/2)||0,
		left=(locationX-width/2)||0,
		right=(locationX+width/2)||0,
		velocityValue=15*gl.zoom,
		impactTop=false,
		impactLeft=false,
		impactRight=false,
		impactFoot=false,
		velocityX = 0,
		velocityY = 0,
		velocityStartY=-55*gl.zoom,
		acceleration=5*gl.zoom,
		jumpLock=true,
		tranLock=true,
		tmpLocationY=0,
		contextStart=0,
		borderWidth=$.canvas.width/5,
		cube=(100*gl.zoom),
		faceTo='right';
		human.jump=function(){
			if(jumpLock){
				jumpLock=false;
				tmpLocationY=locationY;
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
		human.impact=function(map){
		var x=Math.floor((locationX+gl.tran)/(100*gl.zoom)),
			y=Math.floor(locationY/(100*gl.zoom)),
			impactTop=map[x][y-1]>=0?true:false,
			impactLeft=map[x-1][y]>=0?true:false,
			impactRight=map[x+1][y]>=0?true:false,
			impactFoot=map[x][y+1]>=0?true:false;
		};
		human.border=function(){
			return {top:top,right:right,foot:foot,left:left};
		};
		human.refresh=function(){
			locationX+=velocityX;
			locationY+=velocityY;
			top=(locationY+tall/2);
			foot=(locationY-tall/2);
			left=(locationX-width/2);
			right=(locationX+width/2);
			if(!jumpLock){
				velocityY+=acceleration;
				if(locationY>tmpLocationY){
					locationY=tmpLocationY;
					jumpLock=true;
					velocityY=0;
				}
			}
			// $.l(locationX+contextStart+borderWidth+' '+(map[0].length)*(100*gl.zoom));
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
			var _ctx=$.context;
			_ctx.save();
			// _ctx.fillStyle = 'grey';
			_ctx.beginPath();
			if(faceTo=='right'){
				_ctx.drawImage(gl.img.humanRight,locationX-width/2, locationY-tall*3/4, width, tall);
			}else{
				_ctx.drawImage(gl.img.humanLeft,locationX-width/2, locationY-tall*3/4, width, tall);
			}
			// _ctx.rect(locationX-width*3/8, locationY-tall*3/4, width*2/4, tall/4);
			// _ctx.fill();
			// _ctx.beginPath();
			// _ctx.rect(locationX-width/2, locationY-tall/2, width*3/4, tall/2);
			// _ctx.fill();
			// _ctx.beginPath();
			// _ctx.rect(locationX-width*7/16, locationY-tall*2/8, width*1/4, tall/2);
			// _ctx.fill();
			// _ctx.beginPath();
			// _ctx.rect(locationX-width*1/16, locationY-tall*2/8, width*1/4, tall/2);
			// _ctx.fill();
			// _ctx.beginPath();
			// _ctx.rect(locationX-width*10/16, locationY-tall*6/16, width*1/16, tall*7/16);
			// _ctx.fill();
			// _ctx.beginPath();
			// _ctx.rect(locationX+width*5/16, locationY-tall*6/16, width*1/16, tall*7/16);
			// _ctx.fill();
			// _ctx.closePath();
			// _ctx.beginPath();
			// _ctx.fillStyle='lightblue';
			// _ctx.arc(locationX-width*4/16, locationY-tall*10/16, 5*gl.zoom, 0, Math.PI * 2, true);
			// _ctx.fill();
			// _ctx.closePath();
			// _ctx.beginPath();
			// _ctx.fillStyle='lightblue';
			// _ctx.arc(locationX, locationY-tall*10/16, 5*gl.zoom, 0, Math.PI * 2, true);
			// _ctx.fill();
			_ctx.closePath();
			_ctx.restore();
			return human;
		};
	};
	sprite.World=function(map){
		world=this;
		var _width=(100*gl.zoom);
		world.draw=function(){
			$.context.save();
			//i 列 j 行
			for (var i = 0; i < map[0].length; i++) {
				for (var j = 0; j < map.length; j++) {
					switch(map[j][i]){
						case -1:
							// world.drawAir(map[i][j]);
							break;
						case 0:
							// world.drawHuman(map[i][j]);
							break;
						case 1:
							var gress=new sprite.Gress();
							gress.draw(i,j);
							break;
						case 2:
							var wall=new sprite.Wall();
							wall.draw(i,j);
							break;
						case -3:
							var water=new sprite.Water();
							water.draw(i,j);
							break;
						default:
							// world.drawAir(map[i][j]);
					}
				}
			}

			$.context.restore();
		};


	};
	sprite.Gress=function(){
	var gress=this,
		width=(100*gl.zoom),
		height=(100*gl.zoom),
		gressStyle='green';
		gress.draw=function(i,j){
			//屏幕外的就不画了
			if((i+1)*width>=gl.tran&&i*width<=gl.tran+$.canvas.width){
				$.context.save();
				$.context.beginPath();
				$.context.drawImage(gl.img.wall,i*width-gl.tran, height*j+gl.top,width, height);
				$.context.drawImage(gl.img.gress,i*width-gl.tran, height*j+gl.top, width, height/5);
				// $.context.rect(i*width-gl.tran, height*j+gl.top, width, height);
				// $.context.fillStyle = gressStyle;
				// $.context.fill();
				// $.context.stroke();
				$.context.beginPath();
				$.context.restore();
			}
		};
	};
	sprite.Wall=function(){
	var wall=this,
		width=(100*gl.zoom),
		height=(100*gl.zoom);
		// var wallStyle=img;
		wall.draw=function(i,j){
			// img.onload=function(){
				//屏幕外的就不画了
				if((i+1)*width>=gl.tran&&i*width<=gl.tran+$.canvas.width){
					$.context.save();
					$.context.beginPath();
					// $.context.rect(i*width-gl.tran, height*j+gl.top, width, height);
					// $.context.fillStyle = wallStyle;
					// $.context.fill();
					// $.context.stroke();
					$.context.drawImage(gl.img.wall,i*width-gl.tran, height*j+gl.top,width, height);
					$.context.beginPath();
					$.context.restore();
				}
			// };
		};
	};
	sprite.Water=function(){
	var water=this,
		width=(100*gl.zoom),
		height=(100*gl.zoom),
		waterStyle='rgb(0,128,192)';
		water.draw=function(i,j){
			//屏幕外的就不画了
			if((i+1)*width>=gl.tran&&i*width<=gl.tran+$.canvas.width){
				$.context.save();
				$.context.beginPath();
				$.context.rect(i*width-gl.tran, height*j+gl.top, width, height);
				$.context.fillStyle = waterStyle;
				$.context.fill();
				// $.context.stroke();
				$.context.beginPath();
				$.context.restore();
			}
		};
	};
	sprite.BackGround=function(){
		var background=this;
	};
}
