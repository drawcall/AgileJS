(function(Agile, undefined) {
	//image object or image url or css sprite or css class
	function AgileImage(image, width, height) {
		AgileImage._super_.call(this);
		this.x = 0;
		this.y = 0;
		this.delayEventTime = 5;
		//ms

		if (image) {
			if ( typeof image == 'string') {
				var reg = new RegExp('ftp|http|png|jpg|jpeg|gif');
				if (reg.test(image))
					this.image = image;
				else
					this.setClassImage(image);
			} else {
				this.image = image;
			}
		}

		if (width)
			this.width = width;
		if (height)
			this.height = height;
	}


	Agile.Utils.inherits(AgileImage, Agile.DisplayObject);

	AgileImage.prototype.setClassImage = function(className) {
		var _self = this;
		this.addClass(className);
		this.dispatchImageLoadedEvent(function() {
			_self.width = parseFloat(_self.css2('width')) || 0;
			_self.height = parseFloat(_self.css2('height')) || 0;
			_self._avatar.backgroundImage = _self.css2('backgroundImage');
		});
	}

	AgileImage.prototype.__defineGetter__('originalWidth', function() {
		return this._avatar.originalWidth;
	});

	AgileImage.prototype.__defineSetter__('originalWidth', function(originalWidth) {
		this._avatar.originalWidth = originalWidth;
		this.css2('width', this.originalWidth + 'px');
		this.widthSize = true;
	});

	AgileImage.prototype.__defineGetter__('originalHeight', function() {
		return this._avatar.originalHeight;
	});

	AgileImage.prototype.__defineSetter__('originalHeight', function(originalHeight) {
		this._avatar.originalHeight = originalHeight;
		this.css2('height', this.originalHeight + 'px');
		this.heightSize = true;
	});

	AgileImage.prototype.__defineGetter__('image', function() {
		return this._avatar.image;
	});

	AgileImage.prototype.__defineSetter__('image', function(image) {
		var _self = this;
		_self.loaded = false;
		_self._avatar.image = Agile.LoadManager.getImage(image, function(imgObj) {
			if (!_self.widthSize) {
				_self._avatar.width = imgObj.width;
				_self._avatar.originalWidth = imgObj.width;
				_self.css2('width', imgObj.width + 'px');
			}

			if (!_self.heightSize) {
				_self._avatar.height = imgObj.height;
				_self._avatar.originalHeight = imgObj.height;
				_self.css2('height', imgObj.height + 'px');
			}

			_self.backgroundImage = imgObj.src;
			_self.transform();
			_self.dispatchImageLoadedEvent();
		});
	});

	AgileImage.prototype.dispatchImageLoadedEvent = function(fun) {
		var _self = this;
		setTimeout(function() {
			if (fun)
				fun();

			try {
				var customEvent = document.createEvent('CustomEvent');
				customEvent.initCustomEvent(Agile.IMAGE_LOADED, false, false);
				_self.element.dispatchEvent(customEvent);
			} catch(e) {
				var customEvent = document.createEvent("HTMLEvents");
				customEvent.initEvent(Agile.IMAGE_LOADED, false, false);
				_self.element.dispatchEvent(customEvent);
			}
			_self.loaded = true;
		}, _self.delayEventTime);
	}

	AgileImage.prototype.toString = function() {
		return 'Image';
	}

	Agile.Image = AgileImage;
	Agile.AgileImage = AgileImage;
})(Agile);
