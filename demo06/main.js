window.onload=function() {
	//初始化数据
	var $=new jsKid();
	$.context = $.Canvas.init();       //初始化Context
	$.canvas = $.Canvas.base();        //获取Canvas对象
	//设置Canvas，自适应大小
	$.canvas.height=window.innerHeight*0.97||1000;
	$.canvas.width =window.innerWidth*0.97||650;
	$.canvas.style.position='relative';

	//Box2D数据
	var b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2AABB = Box2D.Collision.b2AABB,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2World = Box2D.Dynamics.b2World,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
		//初始化世界
		worldScale = 30,
		world = new b2World(new b2Vec2(0, 10), true),
		border=10;	//边界大小

	DebugDraw();
	//四个边界
	createBox(border, $.canvas.height, border/2, $.canvas.height/2, b2Body.b2_staticBody);
	createBox(border, $.canvas.height, $.canvas.width-border/2, $.canvas.height/2, b2Body.b2_staticBody);
	createBox($.canvas.width, border, $.canvas.width/2, border/2, b2Body.b2_staticBody);
	createBox($.canvas.width, border, $.canvas.width/2, $.canvas.height-border/2, b2Body.b2_staticBody);
	//随机生成盒子
	$.bind(document,"click", function(e) {
		createBox(Math.random() * 50 + 50, Math.random() * 50 + 50, e.layerX, e.layerY, b2Body.b2_dynamicBody);
	});

	function createBox(width, height, pX, pY, type) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = type;
		bodyDef.position.Set(pX / worldScale, pY / worldScale);

		var polygonShape = new b2PolygonShape();
		polygonShape.SetAsBox(width / 2 / worldScale, height / 2 / worldScale);

		var fixtureDef = new b2FixtureDef();
		fixtureDef.density = 1.0;
		fixtureDef.friction = 0.5;
		fixtureDef.restitution = 0.5;
		fixtureDef.shape = polygonShape;

		var body = world.CreateBody(bodyDef);
		body.CreateFixture(fixtureDef);
	}

	function DebugDraw() {
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite($.context);
		debugDraw.SetDrawScale(30.0);
		debugDraw.SetFillAlpha(0.5);
		debugDraw.SetLineThickness(1.0);
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
	$.run(function(){
		var startTime=new Date();
		world.Step(1 / 60, 10, 10);
		world.DrawDebugData();
		world.ClearForces();
		drawInfo(startTime);
	});
};