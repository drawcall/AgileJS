(function(Agile, undefined) {
	function Ellipse(radiusX, radiusY, color) {
		Ellipse._super_.call(this);
		this.radiusX = radiusX || 50;
		this.radiusY = radiusY || 25;
		var color = color || 'purple';
		this.background(color);
		this.x = this.y = 0;
	}


	Agile.Utils.inherits(Ellipse, Agile.DisplayObject);
	Ellipse.prototype.__defineGetter__('radiusX', function() {
		return this._avatar.radiusX;
	});
	Ellipse.prototype.__defineSetter__('radiusX', function(radiusX) {
		this._avatar.radiusX = radiusX;
		this.width = this.radiusX * 2;
		this.css3('borderRadius', this.radiusX + 'px' + ' / ' + this.radiusY + 'px');
	});

	Ellipse.prototype.__defineGetter__('radiusY', function() {
		return this._avatar.radiusY;
	});
	Ellipse.prototype.__defineSetter__('radiusY', function(radiusY) {
		this._avatar.radiusY = radiusY;
		this.height = this.radiusY * 2;
		this.css3('borderRadius', this.radiusX + 'px' + ' / ' + this.radiusY + 'px');
	});

	Ellipse.prototype.toString = function() {
		return 'Ellipse';
	}

	Agile.Ellipse = Ellipse;
})(Agile);
