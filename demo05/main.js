//页面加载完毕后运行
window.onload=function(){
/////////////////////////////////////////////////////////////////////////////
								// 预定义变量、常量
/////////////////////////////////////////////////////////////////////////////
	// var $=new jsKid();
	$=new jsKid();
	//初始化数据
	$.context = $.Canvas.init();       //初始化Context
	$.canvas = $.Canvas.base();        //获取Canvas对象
	$.debug=true;                      //Debug模式(默认开启)，影响$.l()
	//设置Canvas，自适应大小
	$.canvas.height=window.innerHeight*0.97||1000;
	$.canvas.width =window.innerWidth*0.97||650;
	$.canvas.style.position='relative';
	//全局变量，方法
	// var _zoom=0.8;
	var _zoom=$.canvas.height/800;
	gl={

		//坐标左右的偏移
		tran:0,
		zoom:_zoom,
		//计算地图上下偏移位置
		top:$.canvas.height-1000*_zoom,
		img:{
			humanLeft:$.initImg('img/jianshiLeft.png'),
			humanRight:$.initImg('img/jianshiRight.png'),
			floor:$.initImg('img/floor.png')
		},
		imgLength:0,		//总长度
		imgReady:0,			//已经就绪的
		//Canvas中的中文，YUI 压缩时会出现乱码，在这里统一编写
		lang:{
			showinfofont:'18px 微软雅黑',		//系统信息文字大小
			weiwandaixu:'未完待续',				//未完待续文字
			weiwandaixufont:'100px 微软雅黑',	//未完待续文字大小
			donghuahanshu:'动画函数：'			//系统信息中动画函数
		}
	};
/////////////////////////////////////////////////////////////////////////////
								// 初始化框架
/////////////////////////////////////////////////////////////////////////////
	//初始化游戏核心库
	$.sprite=new Sprite($);            //精灵类
	notify = new Notify($);            //初始化Notify
	$.model=new Model($);              //初始化Model
	$.view = new View($);              //初始化View
	$.contraller = new Contraller($);  //初始化Contraller

	//等待图片资源加载完毕
	imgOnloadCallBack=function(){
		gl.imgReady++;
	};
	//遍历所有的图片对象，计算图片数量
	for(var imgName in gl.img){
		gl.imgLength++;
		gl.img[imgName].onload=imgOnloadCallBack;
	}
/////////////////////////////////////////////////////////////////////////////
								// 注册Notify操作
/////////////////////////////////////////////////////////////////////////////
	//创建HumanAction 的MVC模式
	notify.register('creatHumanActionUI', function (args) {
		$.model.humanActionCtrl = new $.contraller.HumanActionCtrl(new $.view.HumanActionView($.model.humanActionModel));
	});
	//显示系统信息
	notify.register('showInfo', function (args) {
		var _args = Object.extend({
			startTime:0,
			x:$.canvas.width-80,
			y:20
		},args),_ctx=$.context;
		//显示动画帧数、刷新次数、数据变换次数
		_ctx.save();
		_ctx.fillStyle = 'red';
		_ctx.font = gl.lang.showinfofont;
		_ctx.fillText('FPS:' + Math.ceil(1000 / (new Date() - _args.startTime + 1)), _args.x, _args.y);
		_ctx.restore();
	});
	//显示调试信息
	notify.register('showDebugInfo', function (args) {
		var _args = Object.extend({
			msg: 'Debug',
			x:100,
			y:100
		},args),_ctx=$.context;
		_ctx.save();
		_ctx.beginPath();
		_ctx.font = gl.lang.weiwandaixufont;
		_ctx.fillStyle='red';
		_ctx.globalAlpha='0.2';
		_ctx.fillText(gl.lang.weiwandaixu,_args.x,_args.y);
		_ctx.closePath();
		_ctx.restore();
	});
	//弹窗测试
	notify.register('alert', function (args) {
		var _args = Object.extend({
			msg: ''
		},args);
		alert(_args.msg);
	});
	//测试信息
	notify.register('test', function (args) {
		var _args = Object.extend({
			type: 'test'
		},args);
		console.log(args);
	});
/////////////////////////////////////////////////////////////////////////////
								// 调用Notify
/////////////////////////////////////////////////////////////////////////////
	var waitForImage=setInterval(function(){
		//图片资源加载完毕后开始主逻辑
		if(gl.imgReady==gl.imgLength){
			//去除定时器
			clearInterval(waitForImage);
			//创建MVC
			notify.notify('creatHumanActionUI',{aa:'aa',bb:'cc'});
			//测试用
			// notify.notify('alert',{msg:'游戏开始'});
		}
	},100);

//test

};