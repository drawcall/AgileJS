var b2Vec2 = Box2D.Common.Math.b2Vec2, b2AABB = Box2D.Collision.b2AABB, b2BodyDef = Box2D.Dynamics.b2BodyDef, b2Body = Box2D.Dynamics.b2Body, b2FixtureDef = Box2D.Dynamics.b2FixtureDef, b2Fixture = Box2D.Dynamics.b2Fixture, b2World = Box2D.Dynamics.b2World, b2MassData = Box2D.Collision.Shapes.b2MassData, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, b2DebugDraw = Box2D.Dynamics.b2DebugDraw, b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
var mousePVec, selectedBody, mouseJoint;
var world, fixDef, bodyDef, stage;
var box2dScale = 30;
var wallsSetted = false;
var walls = new Array(4);
var bodys = [];
var mouseBody;
var CONFIG = {};

Main();

function Main() {
	CONFIG.max = Agile.Device.isPC() ? 200 : 50;
	CONFIG.num = Agile.Device.isPC() ? 30 : 20;

	resize();
	initAgile();
	initBox2d();
	tick();
	addQR();
}

function initAgile() {
	Agile.lockTouch();
	stage = new Agile.Dom('container');
	stage.select = false;
	stage.color = '#ffcc00';

	//touchStart mehtod comes from agile_toolkit.js.You can write it easily!
	stage.touchStart(function(x, y) {
		CONFIG.isMouseDown = true;
		CONFIG.mouseX = x / 30;
		CONFIG.mouseY = y / 30;
		
		if (!Agile.Device.isPC())
			update();
		if (!mouseBody) {
			if (bodys.length < CONFIG.max)
				createBall(x, y, 1, .5, .5);
		}

		mouseBody = null;
	});

	stage.touchMove(function(x, y) {
		CONFIG.mouseX = x / 30;
		CONFIG.mouseY = y / 30;
	});

	stage.touchEnd(function(x, y) {
		CONFIG.isMouseDown = false;
		mouseBody = null;
	});
}

function initBox2d() {
	world = new b2World(new b2Vec2(0, 10), true);
	fixDef = new b2FixtureDef;
	bodyDef = new b2BodyDef;
	createGround();
	createBall(CONFIG.stageWidth * .5, CONFIG.stageHeight * .3, 1, .5, .5);
}

function createGround() {
	//create ground
	if (wallsSetted) {
		for (var i = 0; i < walls.length; i++) {
			world.DestroyBody(walls[i]);
			walls[i] = null;
		}
	}
	bodyDef.type = b2Body.b2_staticBody;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(CONFIG.stageWidth / box2dScale, 2);
	bodyDef.position.Set(0, CONFIG.stageHeight / box2dScale + 1.9);
	walls[0] = world.CreateBody(bodyDef);
	walls[0].CreateFixture(fixDef);
	bodyDef.position.Set(0, -1.9);
	walls[1] = world.CreateBody(bodyDef);
	walls[1].CreateFixture(fixDef);
	fixDef.shape.SetAsBox(2, CONFIG.stageHeight / box2dScale);
	bodyDef.position.Set(-1.9, 0);
	walls[2] = world.CreateBody(bodyDef);
	walls[2].CreateFixture(fixDef);
	bodyDef.position.Set(CONFIG.stageWidth / box2dScale + 1.9, 0);
	walls[3] = world.CreateBody(bodyDef)
	walls[3].CreateFixture(fixDef);
	wallsSetted = true;
}

function createBody($density, $friction, $restitution, $x, $y, $xspeed, $yspeed, $radius) {
	fixDef.density = $density;
	fixDef.friction = $friction;
	fixDef.restitution = $restitution;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = $x / box2dScale;
	bodyDef.position.y = $y / box2dScale;
	fixDef.shape = new b2CircleShape($radius / box2dScale);
	var centerBody = world.CreateBody(bodyDef);
	centerBody.CreateFixture(fixDef);
	centerBody.SetLinearVelocity(new b2Vec2($xspeed, $yspeed));

	return centerBody;
}

function createBall($x, $y, $density, $friction, $restitution) {
	var _x = $x;
	var _y = $y;
	var _radius = Math.random() * CONFIG.num + 20;
	var _xspeed = 0;
	var _yspeed = Math.random() * 10 + 5;

	_radius = Agile.Device.retina() > 1 ? _radius * 1 : _radius;
	var body = createBody($density, $friction, $restitution, _x, _y, _xspeed, _yspeed, _radius);
	var ball = new Agile.Circle(_radius, 'random');
	ball.x = ball.y = -100;
	stage.addChild(ball);
	bodys.push([body, ball]);
}

function getBodyAtMouse() {
	mousePVec = new b2Vec2(CONFIG.mouseX, CONFIG.mouseY);
	var aabb = new b2AABB();
	aabb.lowerBound.Set(CONFIG.mouseX - 0.003, CONFIG.mouseY - 0.003);
	aabb.upperBound.Set(CONFIG.mouseX + 0.003, CONFIG.mouseY + 0.003);
	// Query the world for overlapping shapes.
	selectedBody = null;
	world.QueryAABB(getBodyCB, aabb);
	return selectedBody;
}

function getBodyCB(fixture) {
	if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
		if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
			selectedBody = fixture.GetBody();
			return false;
		}
	}
	return true;
}

function resize() {
	CONFIG.stageWidth = $(window).width();
	CONFIG.stageHeight = $(window).height();
	if (bodyDef)
		createGround();
}

//update
function update() {
	if (CONFIG.isMouseDown && (!mouseJoint)) {
		mouseBody = getBodyAtMouse();
		if (mouseBody) {
			var md = new b2MouseJointDef();
			md.bodyA = world.GetGroundBody();
			md.bodyB = mouseBody;
			md.target.Set(CONFIG.mouseX, CONFIG.mouseY);
			md.collideConnected = true;
			md.maxForce = 10000.0 * mouseBody.GetMass();
			mouseJoint = world.CreateJoint(md);
			mouseBody.SetAwake(true);
		}
	}

	if (mouseJoint) {
		if (CONFIG.isMouseDown) {
			mouseJoint.SetTarget(new b2Vec2(CONFIG.mouseX, CONFIG.mouseY));
		} else {
			world.DestroyJoint(mouseJoint);
			mouseJoint = null;
		}
	}

	world.Step(1 / 60, 10, 10);
	drawAgile();
	world.ClearForces();
};

//////////////
function drawAgile() {
	for (var i = 0; i < bodys.length; i++) {
		var body = bodys[i][0];
		var ball = bodys[i][1];
		if (body != null) {
			ball.x = body.GetPosition().x * 30;
			ball.y = body.GetPosition().y * 30;
			ball.rotation = body.GetAngle() * 180 / Math.PI;
		}
	}
}

function tick() {
	requestAnimationFrame(tick);
	update();
}

function addQR() {
	if (Agile.Device.isPC()) {
		var qrcode = document.createElement('div');
		qrcode.style.position = 'absolute';
		qrcode.style.left = '10px';
		qrcode.style.top = '10px';
		qrcode.style.zIndex = 20;
		document.body.appendChild(qrcode);
		var qrcode = new QRCode(qrcode, {
			text : window.location.href,
			width : 128,
			height : 128,
			colorDark : "#ff5500",
			colorLight : "rgba(0,0,0,0)",
			correctLevel : QRCode.CorrectLevel.L
		});
	}
}