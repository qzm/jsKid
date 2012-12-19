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
		_canvas.style.position = 'relative';
		center = {
			x: _canvas.width / 2,
			y: _canvas.height / 2
		};
		step = (2 * Math.PI) / 60;
		img = $.initImg('img/clock.jpg');
		ctx.lineCap = 'round';
		ctx.lineWidth = 8;
		ctx.fillStyle = 'red';
		ctx.font = '30px _sans';
	});
	img.onload = function () {
		$.run(function () {
			var startTime = new Date();
			//**************************************************************************
			//									动画刷新
			//**************************************************************************
			//重置Canvas
			ctx.clearRect(0, 0, _canvas.width, _canvas.height);
			//画背景图
			ctx.drawImage(img, (_canvas.width - img.width) / 2, (_canvas.height - img.height) / 2);
			_data = new Date();
			ctx.fillText(_data.getHours() + ':' + _data.getMinutes() + ':' + _data.getSeconds(), 440, 200);
			ctx.beginPath();
			//秒针
			ctx.moveTo(center.x, center.y);
			var sec = (_data.getSeconds() - 15) * step;
			var point = getPoint(300, sec);
			ctx.lineTo(point.x, point.y);
			//分针
			ctx.moveTo(center.x, center.y);
			var min = (_data.getMinutes() - 15) * step;
			point = getPoint(250, min);
			ctx.lineTo(point.x, point.y);
			//时针
			ctx.moveTo(center.x, center.y);
			var hour = (_data.getHours() * 5 - 15) * step;
			point = getPoint(200, hour);
			ctx.lineTo(point.x, point.y);

			ctx.closePath();
			ctx.stroke();


			//**********************************End*************************************
			//显示动画帧数、刷新次数、数据变换次数
			ctx.save();
			ctx.fillStyle = 'red';
			ctx.font = '18px _sans';
			ctx.fillText('FPS:' + Math.ceil(1000 / (new Date() - startTime + 1)), 920, 20);
			ctx.fillText('hour:' + _data.getHours(), 920, 40);
			ctx.fillText('min :' + _data.getMinutes(), 920, 60);
			ctx.fillText('sec :' + _data.getSeconds(), 920, 80);

			ctx.restore();
		});
	};


	function getPoint(r, pi) {
		var point = {};
		point.x = Math.ceil(r * Math.cos(pi)) + center.x;
		point.y = Math.ceil(r * Math.sin(pi)) + center.y;
		return point;
	}
});