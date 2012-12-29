function Sprite($){
	var sprite=this;
	sprite.Ball=function (initX, initY, initRadius, initFillColor, initStorkeColor, initLineWidth) {
		var ball=this;
		var x = initX || 0;                               //中点x轴坐标
		var y = initY || 0;                               //中点y轴坐标
		var velocityX = 0;                                //x轴运动速度
		var velocityY = 0;                                //y轴运动速度
		var acceleration = 0;                             //运动加速度
		var radius = initRadius || 0;                     //球的半径
		var fillColor = initFillColor || 'black';         //填充颜色
		var storkeColor = initStorkeColor || 'black';     //描边的颜色
		var lineWidth = initLineWidth || 1;               //描边的粗细
		var envRight = 0;                                 //右边界
		var envFoot = 0;                                  //下边界
		var envLeft = 0;                                  //左边界
		var envTop = 0;                                   //上边界
		//设置球的外部环境
		ball.setEnvironment = function (xLine, yLine,StartX, StartY, Width, Height) {
			velocityX = xLine;                            //X轴的速度
			velocityY = yLine;                            //Y轴的速度
			envRight = Width;                             //右边界
			envFoot = Height;                             //下边界
			envLeft = StartX;                             //左边界
			envTop = StartY;                              //上边界
		};
		//移动球
		ball.move = function () {
			if (ball.leftWall(envLeft) || ball.rightWall(envRight)) {
				ball.turnAround('x');
			}
			if(ball.topWall(envTop)||ball.footWall(envFoot)){
				ball.turnAround('y');
			}

			if(ball.leftWall(envLeft)){
				x=0+radius;
			}
			if(ball.rightWall(envRight)){
				x=$.canvasWidth-radius;
			}

			if(ball.topWall(envTop)){
				y=0+radius;
			}
			if(ball.footWall(envFoot)){
				y=$.canvasHeight-radius;
			}
			x = x + velocityX;
			y = y + velocityY;
		};
		//转方向
		ball.turnAround = function (line) {
			if (line == 'x' || line == 'X') {
				velocityX = -velocityX;
			} else if (line == 'y' || line == 'Y') {
				velocityY = -velocityY;
			}
		};

		//判断是否碰到左边墙壁
		ball.leftWall = function (left) {
			if (x - radius <= left) {
				return true;
			} else {
				return false;
			}
		};
		//判断是否碰到右边墙壁
		ball.rightWall = function (right) {
			if (x + radius >= right) {
				return true;
			} else {
				return false;
			}
		};
		//判断是否碰到上边墙壁
		ball.topWall = function (top) {
			if (y - radius <= top) {
				return true;
			} else {
				return false;
			}
		};
		//判断是否碰到下边墙壁
		ball.footWall = function (foot) {
			if (y + radius >= foot) {
				return true;
			} else {
				return false;
			}
		};
		//绘制图形
		var _ctx=$.context;
		ball.draw=function(){
			_ctx.save();
			_ctx.globalAlpha=0.6;
			_ctx.beginPath();
			_ctx.fillStyle = fillColor;
			_ctx.arc(x, y, radius, 0, Math.PI * 2, true);
			_ctx.fill();
			// _ctx.closePath();
			_ctx.restore();
		};
	};
}