(function(Agile, undefined) {
	function Dom(dom, resetPosition) {
		Dom._super_.call(this);
		if ( typeof dom == 'string')
			this.element = Agile.Css.select(dom);
		else if (dom['jquery'])
			this.element = dom[0];
		else
			this.element = dom;

		if (this.element.getAttribute("id"))
			this._avatar.id = this.element.getAttribute("id");
		else
			this.id = Agile.IDUtils.getID(this.toString());

		this._avatar.width = parseFloat(this.css2('width')) || 0;
		this._avatar.height = parseFloat(this.css2('height')) || 0;
		this._avatar.alpha = this.css2('opacity') == '' || this.css2('opacity') == undefined ? 1 : this.css2('opacity');
		this._avatar.position = this.css2('position') || 'absolute';
		this._avatar.color = this.css2('backgroundColor');
		this._avatar.backgroundImage = this.css2('backgroundImage');
		this._avatar.zIndex = this.css2('zIndex') || 0;
		this._avatar.display = this.css2('display') || 'block';

		if (this._avatar.display != 'none')
			this._avatar.defalutDisplay = this._avatar.display;

		this.transform();
		Agile.agileObjs[this.id] = this;

		if (resetPosition)
			this.resetPosition();
	}


	Agile.Utils.inherits(Dom, Agile.DisplayObject);
	Dom.prototype.createElement = function() {
		//null
	}

	Dom.prototype.resetPosition = function() {
		this.originalWidth = this.width;
		this.originalHeight = this.height;
	}

	Dom.prototype.__defineGetter__('visible', function() {
		return this._avatar.visible;
	});

	Dom.prototype.__defineSetter__('visible', function(visible) {
		this._avatar.visible = visible;
		var defalutDisplay = this._avatar.defalutDisplay ? this._avatar.defalutDisplay : 'block';
		var vis = visible ? defalutDisplay : 'none';
		this.css2('display', vis);
	});

	Dom.prototype.toString = function() {
		return 'Dom';
	}

	Agile.Dom = Dom;
})(Agile);
