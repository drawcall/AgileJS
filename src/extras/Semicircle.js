/**
 * @author a-jie https://github.com/a-jie
 */
(function(Agile, undefined) {
	function Semicircle(radius, color) {
		Semicircle._super_.call(this);
		this.radius = radius || 25;
		var color = color || 'purple';
		this.background(color);
		this.x = this.y = 0;
	}


	Agile.Utils.inherits(Semicircle, Agile.DisplayObject);
	Semicircle.prototype.__defineGetter__('radius', function() {
		return this._avatar.radius;
	});
	Semicircle.prototype.__defineSetter__('radius', function(radius) {
		this._avatar.radius = radius;
		this.width = this.radius * 2;
		this.height = this.radius;
		this.css3('borderRadius', this.radius + 'px ' + this.radius + 'px 0 0');
	});

	Semicircle.prototype.toString = function() {
		return 'Semicircle';
	}

	Agile.Semicircle = Semicircle;
})(Agile);
