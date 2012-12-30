//程序入口
window.onload=function main() {
	//调用核心库
	var $ = new jsKid();
	//初始化资源
	var	c = $.Cache,
		dom = $.Dom,
		sto = $.Storage,
		ctx = $.Canvas.init(),
		canvas = $.Canvas.base(),
		xPoint=0,
		yPoint=0;
		canvas.height = 700;
		canvas.width = 1000;
		canvas.style.position = 'relative';
		center = {
			x: canvas.width / 2,
			y: canvas.height / 2
		};
		img = $.initImg('img/Koala.jpg');
		ctx.lineWidth = 10;
	//监听鼠标移动事件
	$.bind(canvas,'mousemove',function (evevt){
		xPoint=event.layerX;
		yPoint=event.layerY;
	});
	img.onload = function () {
		$.run(function () {
			var startTime = new Date();
			//**************************************************************************
			//									动画刷新
			//**************************************************************************
			//重置Canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			//显示动画帧数、刷新次数、数据变换次数
			ctx.save();
			ctx.fillStyle = 'red';
			ctx.font = '18px _sans';
			ctx.fillText('FPS:' + ((1000 / (new Date() - startTime + 1))>>0), 920, 20);
			ctx.restore();

			//画背景图
			ctx.drawImage(img, (canvas.width - 800) / 2, (canvas.height - 600) / 2, 800, 600);
			//放大镜
			ctx.save();
			ctx.beginPath();
			ctx.arc(xPoint, yPoint, 100, 0, Math.PI * 2, true);
			ctx.clip();
			ctx.drawImage(img, (canvas.width - 1024) / 2, (canvas.height - 768) / 2, 1024, 768);
			ctx.stroke();
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
};