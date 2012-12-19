function Sprite($){
	this.Ball=function (initX, initY, initRadius, initFillColor, initStorkeColor, initLineWidth) {
		var ball=this;
		var x = initX || 0; //中点x轴坐标
		var y = initY || 0; //中点y轴坐标
		var velocityX = 0; //x轴运动速度
		var velocityY = 0; //y轴运动速度
		var acceleration = 0; //运动加速度
		var radius = initRadius || 0; //球的半径
		var fillColor = initFillColor || 'black'; //填充颜色
		var storkeColor = initStorkeColor || 'black'; //描边的颜色
		var lineWidth = initLineWidth || 1; //描边的粗细
		var envWidth = 0;
		var envHeight = 0;
		var envStartX = 0;
		var envStartY = 0;
		//设置球的外部环境
		this.setEnvironment = function (xLine, yLine,StartX, StartY, Width, Height) {
			velocityX = xLine;
			velocityY = yLine;
			envWidth = Width;
			envHeight = Height;
			envStartX = StartX;
			envStartY = StartY;
		};
		//移动球
		this.move = function () {
			if (ball.leftWall(envStartX) || ball.rightWall(envWidth)) {
				ball.turnAround('x');
			}
			if(ball.topWall(envStartY)||ball.footWall(envHeight)){
				ball.turnAround('y');
			}

			if(ball.leftWall(envStartX)){
				x=0+radius;
			}
			if(ball.rightWall(envWidth)){
				x=gl.canvas.width-radius;
			}

			if(ball.topWall(envStartY)){
				y=0+radius;
			}
			if(ball.footWall(envHeight)){
				y=gl.canvas.height-radius;
			}

			x = x + velocityX;
			y = y + velocityY;
		};
		this.turnAround = function (line) {
			if (line == 'x' || line == 'X') {
				velocityX = -velocityX;
			} else if (line == 'y' || line == 'Y') {
				velocityY = -velocityY;
			}
		};

		//判断是否碰到左边墙壁
		this.leftWall = function (left) {
			if (x - radius <= left) {
				return true;
			} else {
				return false;
			}
		};
		//判断是否碰到右边墙壁
		this.rightWall = function (right) {
			if (x + radius >= right) {
				return true;
			} else {
				return false;
			}
		};
		//判断是否碰到上边墙壁
		this.topWall = function (top) {
			if (y - radius <= top) {
				return true;
			} else {
				return false;
			}
		};
		//判断是否碰到下边墙壁
		this.footWall = function (foot) {
			if (y + radius >= foot) {
				return true;
			} else {
				return false;
			}
		};
		this.draw=function(){
			gl.ctx.save();
			gl.ctx.globalAlpha=0.6;
			gl.ctx.beginPath();
			gl.ctx.fillStyle = fillColor;
			gl.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
			gl.ctx.fill();
			gl.ctx.closePath();
			gl.ctx.restore();
		};
	};
	this.Heart=function (initX, initY, initRadius, initFillColor, initStorkeColor, initLineWidth) {
		var ball=this;
		var x = initX || 0; //中点x轴坐标
		var y = initY || 0; //中点y轴坐标
		var velocityX = 0; //x轴运动速度
		var velocityY = 0; //y轴运动速度
		var acceleration = 0; //运动加速度
		var radius = initRadius || 0; //爱心的半径
		var fillColor = initFillColor || 'black'; //填充颜色
		var storkeColor = initStorkeColor || 'black'; //描边的颜色
		var lineWidth = initLineWidth || 1; //描边的粗细
		var envWidth = 0;
		var envHeight = 0;
		var envStartX = 0;
		var envStartY = 0;
		//设置爱心的外部环境
		this.setEnvironment = function (xLine, yLine,StartX, StartY, Width, Height) {
			velocityX = xLine;
			velocityY = yLine;
			envWidth = Width;
			envHeight = Height;
			envStartX = StartX;
			envStartY = StartY;
		};
		//移动爱心
		this.move = function () {
			if (ball.leftWall(envStartX) || ball.rightWall(envWidth)) {
				ball.turnAround('x');
			}
			if(ball.topWall(envStartY)||ball.footWall(envHeight)){
				ball.turnAround('y');
			}

			if(ball.leftWall(envStartX)){
				x=0+radius;
			}
			if(ball.rightWall(envWidth)){
				x=gl.canvas.width-radius;
			}

			if(ball.topWall(envStartY)){
				y=0+radius;
			}
			if(ball.footWall(envHeight)){
				y=gl.canvas.height-radius;
			}

			x = x + velocityX;
			y = y + velocityY;
		};
		this.turnAround = function (line) {
			if (line == 'x' || line == 'X') {
				velocityX = -velocityX;
			} else if (line == 'y' || line == 'Y') {
				velocityY = -velocityY;
			}
		};

		//判断是否碰到左边墙壁
		this.leftWall = function (left) {
			if (x - radius <= left) {
				return true;
			} else {
				return false;
			}
		};
		//判断是否碰到右边墙壁
		this.rightWall = function (right) {
			if (x + radius >= right) {
				return true;
			} else {
				return false;
			}
		};
		//判断是否碰到上边墙壁
		this.topWall = function (top) {
			if (y - radius <= top) {
				return true;
			} else {
				return false;
			}
		};
		//判断是否碰到下边墙壁
		this.footWall = function (foot) {
			if (y + radius >= foot) {
				return true;
			} else {
				return false;
			}
		};
		this.draw=function(){
			gl.ctx.save();
			gl.ctx.beginPath();
			gl.ctx.fillStyle = fillColor;
			gl.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
			gl.ctx.fill();
			gl.ctx.closePath();
			gl.ctx.restore();
		};
	};
}