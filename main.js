//程序入口
window.addEventListener('load', function main() {
	//调用核心库
	var $ = new jsKid();
	//初始化资源
	$.init(function () {
		c = $.Cache;
		dom = $.Dom;
		sto = $.Storage;
		ctx = $.Canvas.init();
		_canvas = $.Canvas.base();
		_canvas.height = 700;
		_canvas.width = 1000;
		_canvas.style.position='relative';
		c.set('xPoint', 0);
		c.set('yPoint', 0);
		c.set('reFresh',0);
		c.set('change',0);
		ctx.fillStyle = 'blue';
	});

//**************************************************************************
//								动画数据更新
//**************************************************************************
	//监听鼠标移动事件
	_canvas.addEventListener('mousemove', function (event) {
		c.set('xPoint', event.layerX);
		c.set('yPoint', event.layerY);
		c.plus('change',1);
	});
//**********************************End*************************************

	$.run(function () {
		var startTime = new Date();
//**************************************************************************
//									动画刷新
//**************************************************************************
		//清屏
		ctx.clearRect(0, 0, _canvas.width, _canvas.height);
		//圆心
		ctx.arc(c.get('xPoint'), c.get('yPoint'), 10, 0, Math.PI * 2, true);
		ctx.fill();
		//正方形
		ctx.strokeRect(c.get('xPoint')-50, c.get('yPoint')-50, 100, 100);
		//X轴
		ctx.beginPath();
		ctx.moveTo(0, c.get('yPoint'));
		ctx.lineTo(_canvas.width, c.get('yPoint'));
		//Y轴
		ctx.moveTo(c.get('xPoint'), 0);
		ctx.lineTo(c.get('xPoint'), _canvas.height);
		ctx.closePath();
		ctx.stroke();
		//坐标点
		ctx.fillText('(' + c.get('xPoint') + ',' + c.get('yPoint') + ')', c.get('xPoint') + 10, c.get('yPoint') - 10);
//**********************************End*************************************
		//显示动画帧数、刷新次数、数据变换次数
		var endTime = new Date();
		ctx.save();
		ctx.fillStyle = 'red';
		ctx.fillText('Refresh:'+c.get('reFresh')+' Change:'+c.get('change'), 10, 10);
		ctx.fillText('FPS:' + parseInt(1000 / (endTime - startTime + 1)), 950, 10);
		ctx.restore();
		c.plus('reFresh', 1);
	});
});
