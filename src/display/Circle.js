(function(Agile, undefined) {
	function Circle(radius, color) {
		Circle._super_.call(this);
		this.radius = radius || 25;
		var color = color || 'purple';
		this.background(color);
		this.x = this.y = 0;
	}


	Agile.Utils.inherits(Circle, Agile.DisplayObject);
	Circle.prototype.__defineGetter__('radius', function() {
		return this._avatar.radius;
	});
	Circle.prototype.__defineSetter__('radius', function(radius) {
		this._avatar.radius = radius;
		this.width = this.height = this.radius * 2;
		this.css3('borderRadius', '50%');
	});

	Circle.prototype.toString = function() {
		return 'Circle';
	}

	Agile.Circle = Circle;
})(Agile);
