(function(Agile, undefined) {
	function Rect(width, height, color) {
		Rect._super_.call(this);
		this.width = width || 50;
		this.height = height || this.width;
		var color = color || 'blue';
		this.background(color);
		this.x = this.y = 0;
	}


	Agile.Utils.inherits(Rect, Agile.DisplayObject);
	Rect.prototype.__defineGetter__('round', function() {
		return this._avatar.round;
	});
	Rect.prototype.__defineSetter__('round', function(round) {
		this._avatar.round = round;
		this.css3('borderRadius', this.round + 'px');
	});
	Rect.prototype.toString = function() {
		return 'Rect';
	}

	Agile.Rect = Rect;
})(Agile);
