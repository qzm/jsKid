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
		c.set('xPoint', 0),
		c.set('yPoint', 0);

//**************************************************************************
//								动画数据更新
//**************************************************************************
	//监听鼠标移动事件
	$.bind(canvas,'mousemove',function (evevt){
		c.set('xPoint', event.layerX);
		c.set('yPoint', event.layerY);
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
		ctx.arc(c.get('xPoint'), c.get('yPoint'), 10, 0, Math.PI * 2, true);
		ctx.fill();
		//正方形
		ctx.strokeRect(c.get('xPoint')-50, c.get('yPoint')-50, 100, 100);
		//X轴
		ctx.beginPath();
		ctx.moveTo(0, c.get('yPoint'));
		ctx.lineTo(canvasWidth, c.get('yPoint'));
		//Y轴
		ctx.moveTo(c.get('xPoint'), 0);
		ctx.lineTo(c.get('xPoint'), canvasHeight);
		ctx.closePath();
		ctx.stroke();
		//坐标点
		ctx.fillText('(' + c.get('xPoint') + ',' + c.get('yPoint') + ')', c.get('xPoint') + 10, c.get('yPoint') - 10);
//**********************************End*************************************
		//显示动画帧数、刷新次数、数据变换次数
		ctx.save();
		ctx.fillStyle = 'red';
		ctx.font='18px _sans';
		ctx.fillText('FPS:' + (1000 / (new Date() - startTime + 1))>>0, 920, 20);
		ctx.restore();
	});
};
