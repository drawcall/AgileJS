(function(Agile, undefined) {
	function Container(dom, mode) {
		if (dom && dom != '3d' && dom != '2d') {
			this.dom = dom;
			Container._super_.call(this, dom);
		} else {
			Container._super_._super_.call(this);
		}

		Agile.containers.push(this);
		this._avatar.mode = '2d';
		this._avatar.regX = Agile.Utils.getCssValue(this, 'transformOrigin', 0, 3) || .5;
		this._avatar.regY = Agile.Utils.getCssValue(this, 'transformOrigin', 1, 3) || .5;
		this._avatar.perspectiveOriginX = .5;
		this._avatar.perspectiveOriginY = .5;
		this._avatar.perspectiveOriginZ = 0;
		if (dom == '3d' || mode == '3d')
			this.mode = '3d';
		else if (dom == '2d' || mode == '2d')
			this.mode = '2d';
	}


	Agile.Utils.inherits(Container, Agile.Dom);

	Container.prototype.createElement = function() {
		if (!this.dom) {
			this._avatar.id = Agile.IDUtils.getID(this.toString());
			this.element = Agile.Css.createElement();
			this.element.setAttribute("id", this._avatar.id);
		}
	}

	Container.prototype.__defineGetter__('mode', function() {
		return this._avatar.mode;
	});

	Container.prototype.__defineSetter__('mode', function(mode) {
		this._avatar.mode = mode;
		var mode = mode == '2d' ? 'flat' : 'preserve-3d';
		this.css3('transformStyle', mode);
	});

	Container.prototype.__defineGetter__('perspective', function() {
		return this._avatar.perspective;
	});

	Container.prototype.__defineSetter__('perspective', function(perspective) {
		this._avatar.perspective = perspective;
		this.css3('perspective', perspective + 'px');
	});

	Container.prototype.__defineGetter__('perspectiveOriginX', function() {
		return this._avatar.perspectiveOriginX;
	});

	Container.prototype.__defineSetter__('perspectiveOriginX', function(perspectiveOriginX) {
		this._avatar.perspectiveOriginX = perspectiveOriginX;
		perspectiveOriginX = this.perspectiveOriginX * 100 + '%';
		perspectiveOriginY = this.perspectiveOriginY * 100 + '%';
		this.css3('perspectiveOrigin', perspectiveOriginX + ' ' + perspectiveOriginY);
	});

	Container.prototype.__defineGetter__('perspectiveOriginY', function() {
		return this._avatar.perspectiveOriginY;
	});

	Container.prototype.__defineSetter__('perspectiveOriginY', function(perspectiveOriginY) {
		this._avatar.perspectiveOriginY = perspectiveOriginY;
		perspectiveOriginX = this.perspectiveOriginX * 100 + '%';
		perspectiveOriginY = this.perspectiveOriginY * 100 + '%';
		this.css3('perspectiveOrigin', perspectiveOriginX + ' ' + perspectiveOriginY);
	});

	Container.prototype.__defineGetter__('perspectiveOriginZ', function() {
		return this._avatar.perspectiveOriginZ;
	});

	Container.prototype.__defineSetter__('perspectiveOriginZ', function(perspectiveOriginZ) {
		this._avatar.perspectiveOriginZ = perspectiveOriginZ;
		perspectiveOriginX = this.perspectiveOriginX * 100 + '%';
		perspectiveOriginY = this.perspectiveOriginY * 100 + '%';
		perspectiveOriginZ = this.perspectiveOriginZ + 'px';
		this.css3('perspectiveOrigin', perspectiveOriginX + ' ' + perspectiveOriginY + ' ' + perspectiveOriginZ);
	});

	Container.prototype.addChild = function(obj) {
		Container._super_.prototype.addChild.call(this, obj);
		obj.backface = this.backface;
		if(Agile.backface == false)
			obj.backface = false;
	}

	Container.prototype.toString = function() {
		return 'Container';
	}

	Container.prototype.destroy = function() {
		Container._super_.prototype.destroy.apply(this);
		Agile.Utils.arrayRemove(Agile.containers, this);
	}

	Agile.Container = Container;
})(Agile);
