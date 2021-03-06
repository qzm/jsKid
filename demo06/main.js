window.onload=function() {
	//初始化数据
	var $=new jsKid();
	$.context = $.Canvas.init();       //初始化Context
	$.canvas = $.Canvas.base();        //获取Canvas对象
	$.debug=false;
	//设置Canvas，自适应大小
	$.canvas.height=window.innerHeight*0.97||1000;
	$.canvas.width =window.innerWidth*0.97||650;
	$.canvas.style.position='relative';

	//Box2D数据
	var b2Vec2 = Box2D.Common.Math.b2Vec2,                       //重力感应
		b2AABB = Box2D.Collision.b2AABB,                         //世界的边界
		b2BodyDef = Box2D.Dynamics.b2BodyDef,                    //默认的刚体类
		b2Body = Box2D.Dynamics.b2Body,                          //创建的刚体
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2World = Box2D.Dynamics.b2World,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
		//初始化世界
		//一米等于30像素
		worldScale = 200,
		//重力加速度
		world = new b2World(new b2Vec2(0, 10), true),
		border=0;	//边界大小
		function createBox(width, height, pX, pY, type) {
			var bodyDef = new b2BodyDef();                               //实例化一个刚体
			bodyDef.type = type;                                         //设置刚体类型
			bodyDef.position.Set(pX / worldScale, pY / worldScale);      //刚体初始位置 Box 已米作为单位

			var polygonShape = new b2PolygonShape();                     //多边形定义，类型为Box
			polygonShape.SetAsBox(width / 2 / worldScale, height / 2 / worldScale);

			var fixtureDef = new b2FixtureDef();                         //材质
			fixtureDef.density = 1;                                      //物体的密度
			fixtureDef.friction = 0.5;                                   //摩擦力
			fixtureDef.restitution = 0.5;                                //弹性
			fixtureDef.shape = polygonShape;                             //形状

			var body = world.CreateBody(bodyDef);                        //在世界中创建刚体
			body.CreateFixture(fixtureDef);
			console.log(body);
		}
	DebugDraw();
	//四个边界
	createBox(border, $.canvas.height, border/2, $.canvas.height/2, b2Body.b2_staticBody);
	createBox(border, $.canvas.height, $.canvas.width-border/2, $.canvas.height/2, b2Body.b2_staticBody);
	createBox($.canvas.width, border, $.canvas.width/2, border/2, b2Body.b2_staticBody);
	createBox($.canvas.width, border, $.canvas.width/2, $.canvas.height-border/2, b2Body.b2_staticBody);
	//随机生成小球
	$.bind($.canvas,"click", function(e) {
		createBox(Math.random() * 100 + 100, Math.random() * 100 + 100, e.layerX, e.layerY, b2Body.b2_dynamicBody);

	});

	function DebugDraw() {
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite($.context);
		debugDraw.SetDrawScale(worldScale);
		debugDraw.SetFillAlpha(0.5);
		debugDraw.SetLineThickness(5.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		world.SetDebugDraw(debugDraw);
	}
	function drawInfo(startTime){
		$.context.save();
		$.context.fillStyle = 'red';
		$.context.font = '18px 微软雅黑';
		$.context.fillText('FPS:' + Math.ceil(1000 / (new Date() - startTime + 1)), $.canvas.width-100, 30);
		$.context.restore();
	}
	console.log(world);
	$.run(function(){
		var startTime=new Date();
		world.Step(1 / 60, 10, 10);
		world.DrawDebugData();
		world.ClearForces();
		drawInfo(startTime);
	});
};