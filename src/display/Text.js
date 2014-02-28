(function(Agile, undefined) {
	function Text(text, size, align, color) {
		Text._super_.call(this);
		this.text = text || '';
		this.size = size || 18;
		this.color = color || '#000';
		this.align = align || 'left';
		this.x = this.y = 0;
		this.regX = this.regY = 0;
	}


	Agile.Utils.inherits(Text, Agile.DisplayObject);
	Text.prototype.__defineGetter__('height', function() {
		return parseFloat(this.css2('height')) || 0;
	});

	Text.prototype.__defineSetter__('height', function(height) {
		this._avatar.height = height;
		if (!this.originalHeight)
			this.originalHeight = height;
		else
			this.scaleY = this.height / this.originalHeight;
	});

	Text.prototype.__defineGetter__('width', function() {
		return parseFloat(this.css2('width')) || 0;
	});

	Text.prototype.__defineSetter__('width', function(width) {
		this._avatar.width = width;
		if (!this.originalWidth)
			this.originalWidth = width;
		else
			this.scaleX = this.width / this.originalWidth;
	});

	Text.prototype.__defineSetter__('text', function(text) {
		this._avatar.text = text;
		if ( typeof this.element.textContent == "string") {
			this.element.textContent = this.text;
		} else {
			this.element.innerText = this.text;
		}
	});
	Text.prototype.__defineGetter__('text', function() {
		return this._avatar.text;
	});

	Text.prototype.__defineSetter__('htmlText', function(htmlText) {
		this._avatar.text = htmlText;
		this.element.innerHTML = this.htmlText;
	});
	Text.prototype.__defineGetter__('htmlText', function() {
		return this._avatar.text;
	});

	Text.prototype.__defineSetter__('align', function(align) {
		this._avatar.align = align;
		this.css2('textAlign', this.align);
	});
	Text.prototype.__defineGetter__('align', function() {
		return this._avatar.align;
	});

	Text.prototype.__defineSetter__('color', function(color) {
		this._avatar.color = color;
		this.css2('color', this.color);
	});
	Text.prototype.__defineGetter__('color', function() {
		return this._avatar.color;
	});

	Text.prototype.__defineSetter__('size', function(size) {
		this._avatar.size = size;
		this.css2('fontSize', this.size + 'px');
	});
	Text.prototype.__defineGetter__('size', function() {
		return this._avatar.size;
	});

	Text.prototype.__defineSetter__('font', function(font) {
		this._avatar.font = font;
		this.css2('fontFamily', this.font);
	});
	Text.prototype.__defineGetter__('font', function() {
		return this._avatar.font;
	});
	
	Text.prototype.__defineSetter__('weight', function(weight) {
		this._avatar.weight = weight;
		this.css2('fontWeight', this.weight);
	});
	Text.prototype.__defineGetter__('weight', function() {
		return this._avatar.weight;
	});

	Text.prototype.__defineSetter__('smooth', function(smooth) {
		if (smooth)
			this.css3('fontSmoothing', 'antialiased !important');
		else
			this.css3('fontSmoothing', null);
	});

	Text.prototype.toString = function() {
		return 'Text';
	}

	Agile.Text = Text;
})(Agile);
