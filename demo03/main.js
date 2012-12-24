//程序入口
window.addEventListener('load', function main() {
	//调用核心库
	var $ = new jsKid();
	//初始化资源
	var c,dom,sto,ctx,_canvas;
	$.init(function () {
		c = $.Cache;
		dom = $.Dom;
		sto = $.Storage;
		ctx = $.Canvas.init();
		_canvas = $.Canvas.base();
		_canvas.height = 700;
		_canvas.width = 1000;
		_canvas.style.position = 'relative';
		center = {
			x: _canvas.width / 2,
			y: _canvas.height / 2
		};
		img = $.initImg('img/Koala.jpg');
		ctx.lineWidth = 10;

	});

	//监听鼠标移动事件
	_canvas.addEventListener('mousemove', function (event) {
		c.set('xPoint', event.layerX);
		c.set('yPoint', event.layerY);
	});
	img.onload = function () {
		$.run(function () {
			var startTime = new Date();
			//**************************************************************************
			//									动画刷新
			//**************************************************************************
			//重置Canvas
			ctx.clearRect(0, 0, _canvas.width, _canvas.height);
			//显示动画帧数、刷新次数、数据变换次数
			ctx.save();
			ctx.fillStyle = 'red';
			ctx.font = '18px _sans';
			ctx.fillText('FPS:' + Math.ceil(1000 / (new Date() - startTime + 1)), 920, 20);
			ctx.restore();

			//画背景图
			ctx.drawImage(img, (_canvas.width - 800) / 2, (_canvas.height - 600) / 2, 800, 600);
			//放大镜
			ctx.save();
			ctx.beginPath();
			ctx.arc(c.get('xPoint'), c.get('yPoint'), 100, 0, Math.PI * 2, true);
			ctx.clip();
			ctx.drawImage(img, (_canvas.width - 1024) / 2, (_canvas.height - 768) / 2, 1024, 768);
			ctx.stroke();

			// fillStyle('rgb(255,255,255)');
			// fill();
			ctx.closePath();
			ctx.restore();



			//**********************************End*************************************
		});
	};

	function getPoint(r, pi) {
		var point = {};
		point.x = Math.ceil(r * Math.cos(pi)) + center.x;
		point.y = Math.ceil(r * Math.sin(pi)) + center.y;
		return point;
	}
});