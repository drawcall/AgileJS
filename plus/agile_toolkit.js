//aigle_toolkit.js only realize some auxiliary functions. It is very simple!!!
//@author a-jie https://github.com/a-jie

(function(Agile, undefined) {
	Agile.lockTouch = function() {
		document.addEventListener('touchmove', function(event) {
			event.preventDefault();
		}, false);
	}

	Agile.setViewport = function(id, scale) {
		scale = scale || 1;
		var content = 'width=device-width, user-scalable=no, minimum-scale=' + scale + ', maximum-scale=' + scale;
		$('#' + id).attr('content', content);
	}

	Agile.Device = {
		isPC : function() {
			var userAgentInfo = navigator.userAgent;
			var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
			var flag = true;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = false;
					break;
				}
			}
			return flag;
		},
		isMobile : function() {
			var userAgentInfo = navigator.userAgent;
			var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
			var flag = false;
			for (var v = 0; v < Agents.length; v++) {
				if (userAgentInfo.indexOf(Agents[v]) > 0) {
					flag = true;
					return flag;
					break;
				}
			}
			return flag;
		},
		retina : function() {
			if (window.devicePixelRatio)
				return window.devicePixelRatio;
			else if (window.retina)
				return 2;
			else
				return 1;
		}
	}

	Agile.DisplayObject.prototype.touchStart = function(fun) {
		this.touchStartHandler = function(e) {
			var x = e['targetTouches'] ? e['targetTouches'][0].pageX : e.pageX;
			var y = e['targetTouches'] ? e['targetTouches'][0].pageY : e.pageY;
			fun(x, y, e);
		}
		var events = Agile.Device.isPC() ? 'mousedown' : 'touchstart';
		this.element.addEventListener(events, this.touchStartHandler);
	}

	Agile.DisplayObject.prototype.stopTouchStart = function() {
		if (this.touchStartHandler) {
			var events = Agile.Device.isPC() ? 'mousedown' : 'touchstart';
			this.element.removeEventListener(events, this.touchStartHandler);
			this.touchStartHandle = null;
		}
	}

	Agile.DisplayObject.prototype.touchMove = function(fun) {
		this.touchMoveHandler = function(e) {
			var x = e['targetTouches'] ? e['targetTouches'][0].pageX : e.pageX;
			var y = e['targetTouches'] ? e['targetTouches'][0].pageY : e.pageY;
			fun(x, y, e);
		}
		var events = Agile.Device.isPC() ? 'mousemove' : 'touchmove';
		this.element.addEventListener(events, this.touchMoveHandler);
	}

	Agile.DisplayObject.prototype.stopTouchMove = function() {
		if (this.touchMoveHandler) {
			var events = Agile.Device.isPC() ? 'mousemove' : 'touchmove';
			this.element.removeEventListener(events, this.touchMoveHandler);
			this.touchMoveHandler = null;
		}
	}

	Agile.DisplayObject.prototype.touchEnd = function(fun) {
		this.touchEndHandler = function(e) {
			fun(e);
		}
		var events = Agile.Device.isPC() ? 'mouseup' : 'touchend';
		this.element.addEventListener(events, this.touchEndHandler);
	}

	Agile.DisplayObject.prototype.stopTouchEnd = function() {
		if (this.touchEndHandler) {
			var events = Agile.Device.isPC() ? 'mouseup' : 'touchend';
			this.element.removeEventListener(events, this.touchEndHandler);
			this.touchEndHandler = null;
		}
	}
})(Agile);
