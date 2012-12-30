//程序入口
window.onload=function main() {
	//初始化资源
	var $ = new jsKid(),
		c = $.Cache,
		dom = $.Dom,
		ctx = $.Canvas.init(),
		canvas = $.Canvas.base();

		canvas.height = 700,
		canvas.width = 1000,
		canvasHeight=canvas.height,
		canvasWidth=canvas.width,
		canvas.style.position='relative',
		xPoint=0,
		yPoint=0,

//**************************************************************************
//								动画数据更新
//**************************************************************************
	//监听鼠标移动事件
	$.bind(canvas,'mousemove',function (evevt){
		xPoint=event.layerX;
		yPoint=event.layerY;
	});
//**********************************End*************************************

	$.run(function () {
		var startTime = new Date();
//**************************************************************************
//									动画刷新
//**************************************************************************
		//重置Canvas
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		//圆心
		ctx.fillStyle = 'blue';
		ctx.arc(xPoint, yPoint, 10, 0, Math.PI * 2, true);
		ctx.fill();
		//正方形
		ctx.strokeRect(xPoint-50, yPoint-50, 100, 100);
		//X轴
		ctx.beginPath();
		ctx.moveTo(0, yPoint);
		ctx.lineTo(canvasWidth, yPoint);
		//Y轴
		ctx.moveTo(xPoint, 0);
		ctx.lineTo(xPoint, canvasHeight);
		ctx.closePath();
		ctx.stroke();
		//坐标点
		ctx.fillText('(' + xPoint + ',' + yPoint + ')', xPoint + 10, yPoint - 10);
//**********************************End*************************************
		//显示动画帧数、刷新次数、数据变换次数
		ctx.save();
		ctx.fillStyle = 'red';
		ctx.font='18px _sans';
		ctx.fillText('FPS:' + ((1000 / (new Date() - startTime + 1))>>0), 920, 20);
		ctx.restore();
	});
};
