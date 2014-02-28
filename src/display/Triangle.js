(function(Agile, undefined) {
	function Triangle(width, height, color) {
		Triangle._super_.call(this);
		this.css({
			'width' : '0px',
			'height' : '0px'
		});
		this.css({
			'borderStyle' : 'solid',
			'borderTopColor' : 'transparent',
			'borderRightColor' : 'transparent',
			'borderLeftColor' : 'transparent'
		}, 3);
		this.width = width || 100;
		this.height = height || 173.2;
		this.color = color || '#00cc22';
		this.x = this.y = 0;
	}


	Agile.Utils.inherits(Triangle, Agile.DisplayObject);
	Triangle.prototype.__defineGetter__('color', function() {
		return this._avatar.color;
	});

	Triangle.prototype.__defineSetter__('color', function(color) {
		this._avatar.color = color;
		this.css3('borderBottomColor', this.color);
	});

	Triangle.prototype.__defineGetter__('originalWidth', function() {
		return this._avatar.originalWidth
	});

	Triangle.prototype.__defineSetter__('originalWidth', function(originalWidth) {
		this._avatar.originalWidth = originalWidth;
	});

	Triangle.prototype.__defineGetter__('originalHeight', function() {
		return this._avatar.originalHeight
	});

	Triangle.prototype.__defineSetter__('originalHeight', function(originalHeight) {
		this._avatar.originalHeight = originalHeight;
	});

	Triangle.prototype.__defineGetter__('width', function() {
		return this._avatar.width;
	});

	Triangle.prototype.__defineSetter__('width', function(width) {
		this._avatar.width = width;
		if (!this.originalWidth) {
			this.originalWidth = width;
			this.css({
				'borderWidth' : '0px',
				'borderRightWidth' : width + 'px',
				'borderLeftWidth' : width + 'px'
			}, 3);
		} else {
			this.scaleX = this.width / this.originalWidth;
		}
	});

	Triangle.prototype.__defineGetter__('height', function() {
		return this._avatar.height;
	});

	Triangle.prototype.__defineSetter__('height', function(height) {
		this._avatar.height = height;
		if (!this.originalHeight) {
			this.originalHeight = height;
			this.css({
				'borderTopWidth' : '0px',
				'borderBottomWidth' : height + 'px',
			}, 3);
		} else {
			this.scaleY = this.height / this.originalHeight;
		}
	});

	Triangle.prototype.toString = function() {
		return 'Triangle';
	}

	Agile.Triangle = Triangle;
})(Agile);
