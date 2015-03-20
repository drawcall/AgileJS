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
		this._avatar.ox = 0;
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
		if (color == 'random' || color == '#random')
			color = Agile.Color.randomColor();
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
			this._avatar.ox = width / 2;
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
				'borderBottomWidth' : height + 'px'
			}, 3);
		} else {
			this.scaleY = this.height / this.originalHeight;
		}
	});

	Triangle.prototype.__defineGetter__('x', function() {
		return this._avatar.x + this._avatar.ox;
	});

	Triangle.prototype.__defineSetter__('x', function(x) {
		this._avatar.x = x - this._avatar.ox;
		this.transform();
	});

	Triangle.prototype.transform = function() {
		if (Agile.mode == '3d' && Agile.support3d) {
			var parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth : 0;
			var parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight : 0;
			var thisOffsetX = this.regX * this.originalWidth;
			var thisOffsetY = this.regY * this.originalHeight;
			var translate = 'translate3d(' + (this._avatar.x - thisOffsetX + parentOffsetX) + 'px,' + (this.y - thisOffsetY + parentOffsetY) + 'px,' + this.z + 'px) ';
			var rotate = 'rotateX(' + this.rotationX + 'deg) ' + 'rotateY(' + this.rotationY + 'deg) ' + 'rotateZ(' + this.rotationZ + 'deg) ';
			var scale = 'scale3d(' + this.scaleX + ',' + this.scaleY + ',' + this.scaleZ + ') ';
			var skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';
			this.css3('transform', translate + rotate + scale + skew);
		} else {
			var parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth : 0;
			var parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight : 0;
			var thisOffsetX = this.regX * this.originalWidth;
			var thisOffsetY = this.regY * this.originalHeight;
			var translate = 'translate(' + (this._avatar.x - thisOffsetX + parentOffsetX) + 'px,' + (this.y - thisOffsetY + parentOffsetY) + 'px) ';
			var rotate = 'rotate(' + this.rotationZ + 'deg) ';
			var scale = 'scale(' + this.scaleX + ',' + this.scaleY + ') ';
			var skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';
			this.css3('transform', translate + rotate + scale + skew);
		}
	}

	Triangle.prototype.getCirumRadius = function() {
		var tha = 2 * Math.atan2(this.height, this.width);
		return this.width / Math.sin(tha);
	}

	Triangle.prototype.regCircumcenter = function() {
		this.regY = this.getCirumRadius() / this.height;
	}

	Triangle.prototype.toString = function() {
		return 'Triangle';
	}

	Agile.Triangle = Triangle;
})(Agile);
