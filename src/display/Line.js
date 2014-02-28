(function(Agile, undefined) {
	function Line(size, color) {
		Line._super_.call(this);
		this.regX = 0;
		this.regY = 0;
		this._avatar.fromX = 0;
		this._avatar.fromY = 0;
		this.size = size || 3;
		this.color = color || 'blue';
		this.x = this.y = 0;
		this.lines = [];
	}


	Agile.Utils.inherits(Line, Agile.DisplayObject);
	Line.prototype.__defineGetter__('color', function() {
		return this._avatar.color;
	});
	Line.prototype.__defineSetter__('color', function(color) {
		this._avatar.color = color;
	});
	Line.prototype.__defineGetter__('size', function() {
		return this._avatar.size;
	});
	Line.prototype.__defineSetter__('size', function(size) {
		this._avatar.size = size;
	});

	Line.prototype.moveTo = function(x, y) {
		this._avatar.fromX = x;
		this._avatar.fromY = y;
	}

	Line.prototype.lineTo = function(x, y) {
		var x1 = this._avatar.fromX;
		var y1 = this._avatar.fromY;
		var length = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
		var angle = Math.atan2(y - y1, x - x1) * 180 / Math.PI;
		var line = Agile.Css.createElement();
		Agile.Css.css(line, {
			'backgroundColor' : this.color,
			'width' : length + 'px',
			'height' : this.size + 'px',
			'position' : 'absolute'
		});
		if (Agile.mode == '3d') {
			var translate = 'translate3d(' + this._avatar.fromX + 'px,' + this._avatar.fromY + 'px,0px) ';
			var rotate = 'rotateZ(' + angle + 'deg)';
		} else {
			var translate = 'translate(' + this._avatar.fromX + 'px,' + this._avatar.fromY + 'px) ';
			var rotate = 'rotate(' + angle + 'deg)';
		}
		Agile.Css.css3(line, 'transformOrigin', 'left center');
		Agile.Css.css3(line, 'transform', translate + rotate);
		this.element.appendChild(line);
		this._avatar.fromX = x;
		this._avatar.fromY = y;
		this._avatar.width = Math.max(x, this._avatar.width);
		this._avatar.height = Math.max(y, this._avatar.height);
		this.css2('width', this.width + 'px');
		this.css2('height', this.height + 'px');
		this.lines.push(line);
		return line;
	}

	Line.prototype.curveTo = function(x, y, s) {
		var x1 = this._avatar.fromX;
		var y1 = this._avatar.fromY;
		var s = Agile.Utils.initValue(s, .5);
		var length = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
		var tha = Math.PI / 4;
		length /= .707;
		length -= 4 * this.size;
		var angle = Math.atan2(y - y1, x - x1) * 180 / Math.PI;
		var line = Agile.Css.createElement();
		var w = length;
		var h = length;
		var size = Math.max(Math.abs(this.size / s), 1);
		Agile.Css.css(line, {
			'width' : w + 'px',
			'height' : h + 'px',
			'position' : 'absolute'
		});
		Agile.Css.css(line, {
			'borderStyle' : 'solid',
			'borderTopColor' : this.color,
			'borderRightColor' : 'transparent',
			'borderLeftColor' : 'transparent',
			'borderBottomColor' : 'transparent',
			'borderWidth' : size + 'px'
		}, 3);

		var offsetX = w / 2 * (1 - Math.cos(tha));
		var offsetY = h / 2 * (1 - Math.sin(tha));
		if (Agile.mode == '3d') {
			var translate = 'translate3d(' + (this._avatar.fromX - offsetX) + 'px,' + (this._avatar.fromY - offsetY) + 'px,0px) ';
			var rotate = 'rotateZ(' + angle + 'deg) ';
			var scale = 'scale3d(1,' + s + ',1)';
		} else {
			var translate = 'translate(' + (this._avatar.fromX - offsetX) + 'px,' + (this._avatar.fromY - offsetY) + 'px) ';
			var rotate = 'rotate(' + angle + 'deg)';
			var scale = 'scale(1,' + s + ')';
		}
		Agile.Css.css3(line, 'transformOrigin', offsetX * 100 / w + '% ' + offsetY * 100 / w + '%');
		Agile.Css.css3(line, 'transform', translate + rotate + scale);
		Agile.Css.css3(line, 'borderRadius', '50% 50%');
		this.element.appendChild(line);
		this._avatar.fromX = x;
		this._avatar.fromY = y;
		this._avatar.width = Math.max(x, this._avatar.width);
		this._avatar.height = Math.max(y, this._avatar.height);
		this.css2('width', this.width + 'px');
		this.css2('height', this.height + 'px');
		this.lines.push(line);
		return line;
	}

	Line.prototype.clear = function() {
		for (var i = 0, length = this.lines.length; i < length; i++) {
			this.element.removeChild(this.lines[i]);
			this.lines[i] = null;
		}
		this.lines.length = 0;
	}

	Line.prototype.toString = function() {
		return 'Line';
	}

	Agile.Line = Line;
})(Agile);
