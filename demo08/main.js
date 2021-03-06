window.onload = function() {
	/////////////////////////////////////////////////////////////////////////////
	// 初始化数据
	/////////////////////////////////////////////////////////////////////////////
	//初始化游戏核心库
	var $ = new jsKid();
	//初始化数据
	$.context = $.Canvas.init();      //初始化Context
	$.canvas = $.Canvas.base();       //获取Canvas对象
	$.debug = true;                   //Debug模式(默认开启)，影响$.l()
	$.sprite = new Sprite($);         //精灵类
	notify = new Notify($);           //初始化Notify
	$.model = new Model($);           //初始化Model
	$.view = new View($);             //初始化View
	$.contraller = new Contraller($); //初始化Contraller
	//设置Canvas，自适应大小 将宽高赋值给一个变量，避免多次调用Dom节点
	$.canvasHeight=$.canvas.height = window.innerHeight * 0.97 || 1000;
	$.canvasWidth=$.canvas.width = window.innerWidth * 0.97 || 650;
	$.canvas.style.position = 'relative';

	//全局变量，方法
	gl = {
		showInfo: function(startTime, x, y) {
			//显示动画帧数、刷新次数、数据变换次数
			var _ctx = $.context;
			_ctx.save();
			_ctx.fillStyle = 'red';
			_ctx.font = '18px 微软雅黑';
			var fen = window.requestAnimationFrame.toString().split(' ');
			if(fen[1].indexOf('callback') >= 0) {
				fen[1] = 'setTimeout()';
			}
			_ctx.fillText('动画函数:' + fen[1], 5, y);
			_ctx.fillText('FPS:' + Math.ceil(1000 / (new Date() - startTime + 1)), x, y);
			_ctx.restore();
			return this;
		}
	};

	/////////////////////////////////////////////////////////////////////////////
	// 注册Notify操作
	/////////////////////////////////////////////////////////////////////////////
	//创建HumanAction 的MVC模式
	notify.register('creatHumanActionUI', function(args) {
		var _args = args || {
			data: null
		};
		$.model.humanActionCtrl = new $.contraller.HumanActionCtrl(new $.view.HumanActionView($.model.humanActionModel));
	});
	/////////////////////////////////////////////////////////////////////////////
	// 调用Notify
	/////////////////////////////////////////////////////////////////////////////
	//创建MVC
	notify.notify('creatHumanActionUI');

	

};