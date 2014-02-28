(function(Agile, undefined) {
	function LoadManager() {
		var _self = this;
		this._urls = [];
		this._loaderList = [];
		this._targetList = {};
		this._fileSize = [];
		this._num = 0;
		this._loadScale = 0;
		this._totalSize = 0;
		this._oldScale = 0;
		this.baseURL = '';

		this.completeHandler = function(e) {
			for (var index in _self._targetList) {
				if (_self._loaderList[_self._num - 1].getAttribute('data-url') == _self._targetList[index])
					_self._targetList[index] = _self._loaderList[_self._num - 1];
			}
			_self.singleLoad();
			_self.dispatchEvent({
				type : Agile.SINGLE_LOADED
			});
		}

		this.ioErrorHandler = function(e) {
			_self._targetList.push(null);
			_self.singleLoad();
			_self.dispatchEvent({
				type : Agile.LOAD_ERROR
			});
		}
	}


	Agile.EventDispatcher.prototype.apply(LoadManager.prototype);
	LoadManager.prototype.__defineGetter__('loadScale', function() {
		return this._loadScale / this._urls.length;
	});
	LoadManager.prototype.__defineGetter__('loadID', function() {
		return this._num;
	});
	LoadManager.prototype.__defineGetter__('targetList', function() {
		return this._targetList;
	});
	LoadManager.prototype.__defineGetter__('loaderList', function() {
		return this._loaderList;
	});

	LoadManager.prototype.__defineSetter__('fileSize', function($size) {
		this._fileSize = $size;
		this._totalSize = 0;
		for (var i = 0; i < this._fileSize.length; i++) {
			this._totalSize += this._fileSize[i];
		}
	});

	LoadManager.prototype.load = function() {
		var index = 0;
		for (var i = 0; i < arguments.length; i++) {
			var url = arguments[i];

			if ( typeof url == 'string') {
				this._targetList['' + index] = url;
				this._urls.push(url);
				index++;
			} else if (Agile.Utils.isArray(url)) {
				for (var j = 0; j < url.length; j++) {
					this._targetList['' + index] = url[j];
					this._urls.push(url[j]);
					index++;
				}
			} else {
				for (var index in url) {
					this._targetList[index] = url[index];
					this._urls.push(url[index]);
				}
			}
		}

		this.singleLoad();
	}

	LoadManager.prototype.singleLoad = function() {
		if (this._num >= this._urls.length) {
			this._loadScale = this._urls.length;
			this.dispatchEvent({
				type : Agile.GROUP_LOADED
			});
			return;
		}

		var url = String(this._urls[this._num]);
		var image = new Image();
		image.onerror = this.ioErrorHandler;
		image.onload = this.completeHandler;
		image.src = this.baseURL + url;
		image.setAttribute('data-url', url);
		this._loaderList.push(image);
		this._num++;
		this._loadScale++;
	}

	LoadManager.prototype.scaleFUN = function($scale) {
		if (this._totalSize == 0)
			this._loadScale = this._oldScale + ($scale) / this._urls.length;
		else
			this._loadScale = this._oldScale + ($scale) * (this._fileSize[this._num - 1] / this._totalSize);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	LoadManager.imageBuffer = {};
	LoadManager.getImage = function(img, fun) {
		if ( typeof img == 'string') {
			if (LoadManager.imageBuffer[img]) {
				fun(LoadManager.imageBuffer[img]);
			} else {
				var self = this;
				var myImage = new Image();
				myImage.onload = function(e) {
					LoadManager.imageBuffer[img] = myImage;
					fun(LoadManager.imageBuffer[img]);
				}
				myImage.src = img;
			}
			return img;
		} else if ( typeof img == 'object') {
			LoadManager.imageBuffer[img.src] = img;
			fun(LoadManager.imageBuffer[img.src]);
			return img.src;
		}
	};

	Agile.LoadManager = LoadManager;
})(Agile);
