(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Agile = factory());
}(this, (function () { 'use strict';

var Agile$1 = {
    GROUP_LOADED: 'groupLoaded',
    SINGLE_LOADED: 'singleLoaded',
    LOAD_ERROR: 'loadError',
    IMAGE_LOADED: 'imageLoaded',

    _avatar: {
        mode: '2d',
        support3d: true,
        backface: true
    },

    keywordArr: ['x', 'y', 'z', 'width', 'height', 'color', 'regX', 'regY', 'alpha', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY', 'zIndex', 'round', 'radius', 'radiusX', 'radiusY', 'originalWidth', 'originalHeight'],
    perspective: 500,
    DEFAULT_DEPTH: 100,
    agileObjs: {},
    containers: [],

    getEleById: function getEleById(id) {
        return this.agileObjs[id];
    },


    get keyword() {
        if (!this._avatar.keyword) this._avatar.keyword = '_' + this.keywordArr.join('_') + '_';
        return this._avatar.keyword;
    },

    get transform() {
        if (!this._avatar.transform) this._avatar.transform = this.Css.getPrefix(2) + 'transform';
        return this._avatar.transform;
    },

    get transformOrigin() {
        if (!this._avatar.transformOrigin) this._avatar.transformOrigin = this.Css.getPrefix(2) + 'transform-origin';
        return this._avatar.transformOrigin;
    },

    get mode() {
        return this._avatar.mode;
    },

    set mode(mode) {
        if (this.support3d) this._avatar.mode = mode;else this._avatar.mode = '2d';
    },

    get support3d() {
        if (!this._avatar.support3d) this._avatar.support3d = this.Css.support3d();
        return this._avatar.support3d;
    },

    get backface() {
        return this._avatar.backface;
    },

    set backface(backface) {
        this._avatar.backface = backface;
        for (var key in this.agileObjs) {
            var agile = this.agileObjs[key];
            agile.backface = backface;
        }
    }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Css = {
	select: function select(val) {
		if (/^(#|\.).*/g.test(val) || val === 'body') return document.querySelector(val);else return document.getElementById(val);
	},
	createElement: function createElement() {
		var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'div';

		return document.createElement(tag);
	},
	attr: function attr(element, key, val) {
		if (val === undefined) return element.getAttribute(key);

		element.setAttribute(key, val);
	},
	css: function css(element, style) {
		var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

		if ((typeof style === 'undefined' ? 'undefined' : _typeof(style)) === 'object') {
			for (var ss in style) {
				if (value === 2) this.css2(element, ss, style[ss]);else this.css3(element, ss, style[ss]);
			}

			return null;
		} else {
			return this.css2(element, style, value);
		}
	},
	css2: function css2(element, style, value) {
		if (!(value === undefined)) {
			element.style['' + style] = value;
			return value;
		} else {
			var computedStyle = getComputedStyle(element, '');
			return element.style['' + style] || computedStyle.getPropertyValue('' + style);
		}
	},
	css3j: function css3j(element, style, value) {
		element.style[style] = '-webkit-' + value;
		element.style[style] = '-moz-' + value;
		element.style[style] = '-ms-' + value;
		element.style[style] = '-o-' + value;
		element.style[style] = '' + value;
	},
	css3: function css3(element, style, value) {
		var fixStyle = style.charAt(0).toUpperCase() + style.substr(1);

		if (!(value === undefined)) {
			element.style['Webkit' + fixStyle] = value;
			element.style['Moz' + fixStyle] = value;
			element.style['ms' + fixStyle] = value;
			element.style['O' + fixStyle] = value;
			element.style['' + style] = value;
		} else {
			return this.getCss3(element, style);
		}
	},
	getCss3: function getCss3(element, style) {
		var computedStyle = getComputedStyle(element, '');
		var a = element.style['' + style] || element.style['-webkit-' + style] || element.style['-o-' + style] || element.style['-ms-' + style] || element.style['-moz-' + style];
		var b = computedStyle.getPropertyValue('' + style) || computedStyle.getPropertyValue('-webkit- ' + style) || computedStyle.getPropertyValue('-o-' + style) || computedStyle.getPropertyValue('-ms-' + style) || computedStyle.getPropertyValue('-moz-' + style);

		return a || b;
	},
	bakCss3: function bakCss3(element, style, value) {
		if (!(value === undefined)) {
			element.style['-webkit-' + style] = value;
			element.style['-moz-' + style] = value;
			element.style['-ms-' + style] = value;
			element.style['-o-' + style] = value;
			element.style['' + style] = value;

			return value;
		} else {
			var computedStyle = getComputedStyle(element, '');
			var a = element.style['' + style] || element.style['-webkit-' + style] || element.style['-o-' + style] || element.style['-ms-' + style] || element.style['-moz-' + style];
			var b = computedStyle.getPropertyValue('' + style) || computedStyle.getPropertyValue('-webkit- ' + style) || computedStyle.getPropertyValue('-o-' + style) || computedStyle.getPropertyValue('-ms-' + style) || computedStyle.getPropertyValue('-moz-' + style);
			return a || b;
		}
	},
	addClass: function addClass(element, newClassName) {
		var className = element.className;
		var blank = className !== '' ? ' ' : '';

		if (!this.hasClass(element, newClassName)) element.className = className + blank + newClassName;
	},
	removeClass: function removeClass(element, cls) {
		if (this.hasClass(element, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			element.className = element.className.replace(reg, '');
		}
	},
	hasClass: function hasClass(element, className) {
		return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	},
	getDynamicSheet: function getDynamicSheet() {
		if (!this['dynamicSheet']) {
			var style = document.createElement('style');
			style.rel = 'stylesheet';
			style.type = 'text/css';
			document.getElementsByTagName('head')[0].appendChild(style);
			this['dynamicSheet'] = style.sheet;
		}

		return this['dynamicSheet'];
	},
	getTestElement: function getTestElement() {
		if (!this['testElement']) this['testElement'] = document.createElement('div');
		return this['testElement'];
	},
	getPrefix: function getPrefix() {
		var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

		var prefix = '';
		var prefixs = ['Moz', 'Webkit', 'ms', 'O', ''];

		for (var i = 0, length = prefixs.length; i < length; i++) {
			var css3Prefix = prefixs[i];

			if (css3Prefix + 'Transition' in this.getTestElement().style) {
				if (type !== 1) {
					prefix = css3Prefix.toLocaleLowerCase();
					if (prefix !== '') prefix = '-' + prefix + '-';
				} else {
					prefix = css3Prefix;
				}

				return prefix;
			}
		}
		return prefix;
	},
	support3d: function support3d() {
		var support3d = void 0;
		var el = document.createElement('p');
		var transforms = {
			'webkitTransform': '-webkit-transform',
			'OTransform': '-o-transform',
			'msTransform': '-ms-transform',
			'MozTransform': '-moz-transform',
			'transform': 'transform'
		};

		document.body.insertBefore(el, null);
		for (var t in transforms) {
			if (el.style[t] !== undefined) {
				el.style[t] = 'translate3d(1px,1px,1px)';
				support3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
			}
		}
		document.body.removeChild(el);

		return support3d !== undefined && support3d.length > 0 && support3d !== 'none';
	}
};

var Utils = {
	keys: function keys(object) {
		return Object.keys(object);
	},
	isNumber: function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	},
	isArray: function isArray(val) {
		return Object.prototype.toString.call(val) === '[object Array]';
	},
	isEmpty: function isEmpty(obj) {
		if (!obj) return true;

		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) return false;
		}

		return true;
	},
	isMobile: function isMobile() {
		return (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(window.navigator.userAgent.toLowerCase())
		);
	},
	arrayRemove: function arrayRemove(arr, val) {
		var index = arr.indexOf(val);
		if (index > -1) arr.splice(index, 1);

		return index;
	},
	destroyObject: function destroyObject(obj) {
		for (var o in obj) {
			delete obj[o];
		}
	},
	objectforkey: function objectforkey(obj, val) {
		for (var key in obj) {
			var index = obj[key].indexOf(val);
			if (index === 0 && obj[key].charAt(index + val.length) === ' ') return key;
		}

		return null;
	},
	initValue: function initValue(a, b) {
		var s = a === undefined || a === null ? b : a;
		return s;
	},
	getCssValue: function getCssValue(agileEle, style, index, css3) {
		var str = void 0;
		if (css3 === 3) str = this.getStyleBySpace(agileEle.css3(style), index);else str = this.getStyleBySpace(agileEle.css2(style), index);

		return str ? this.otherToFloat(str) : null;
	},
	getStyleBySpace: function getStyleBySpace(str, index) {
		if (!str) return null;
		var arr = str.split(' ');

		if (index >= arr.lenght) return null;else return arr[index];
	},
	replace: function replace(str, a, b) {
		var s = '';
		if (this.isArray(a)) {
			for (var i = 0; i < a.length; i++) {
				// if (i != a.length - 1)
				s += a[i] + '|';
			}
		} else {
			s = a;
		}

		return str.replace(new RegExp(s, 'gm'), b);
	},
	browser: function browser() {
		var isOpera = !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
		var isChrome = !!window.chrome && !!window.chrome.webstore;

		return { isOpera: isOpera, isFirefox: isFirefox, isSafari: isSafari, isIE: isIE, isChrome: isChrome };
	}
};

var Color$1 = {
	gradient: function gradient() {
		var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'linear';

		var color = void 0;

		for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			rest[_key - 1] = arguments[_key];
		}

		if (type === 'linear' || type === 'line') {
			color = 'linear-gradient(';
			for (var i = 0, length = rest.length; i < length; i++) {
				if (i === 0 && Utils.isNumber(rest[i])) {
					color += this.getDirection(rest[i]);
				} else if (i === length - 1) {
					color += rest[i] + ')';
				} else {
					color += rest[i] + ',';
				}
			}

			return color;
		} else if (type === 'radial' || type === 'rad') {
			color = 'radial-gradient(';
			for (var _i = 0, _length = rest.length; _i < _length; _i++) {
				if (_i === _length - 1) color += rest[_i] + ')';else color += rest[_i] + ',';
			}

			return color;
		}
	},
	getDirection: function getDirection(deg) {
		var dir = void 0;
		if (deg === 0) {
			dir = 'to bottom,';
		} else if (deg === 180) {
			dir = deg + 'to up,';
		} else if (deg === 90) {
			dir = deg + 'to right,';
		} else if (deg === 270) {
			dir = deg + 'to left,';
		} else {
			dir = deg + 'deg,';
		}

		return dir;
	},
	rgba: function rgba(r, g, b, a) {
		a = Utils.initValue(a, 1);
		return 'rbga(' + r + ',' + g + ',' + b + ',' + a + ')';
	},
	hsl: function hsl(h) {
		var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
		var l = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
		return 'hsl(' + h + ', ' + s + '%, ' + l + '%, a)';
	},
	randomColor: function randomColor() {
		return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
	},


	alpha0: 'transparent'
};

var IDCache = {};

var IDUtils = {
	generateID: function generateID(name) {
		if (!IDCache[name]) IDCache[name] = 0;
		return name + '_' + IDCache[name]++;
	}
};

var DisplayObject = function () {
    function DisplayObject() {
        classCallCheck(this, DisplayObject);

        this._avatar = {
            id: '',
            x: 0,
            y: 0,
            z: 0,
            regX: .5,
            regY: .5,
            width: 0,
            height: 0,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            skewX: 0,
            skewY: 0,
            zIndex: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            visible: true,
            position: 'absolute',
            color: null,
            backgroundImage: null,
            originalWidth: null,
            originalHeight: null,
            realWidth: null,
            realHeight: null,
            backface: true,
            maxChildrenDepth: 0
        };

        this.numChildren = 0;
        this.childrens = [];
        this.filters = [];
        this.animations = {};
        this.transitions = {};
        this.parent = null;
        this.createElement();

        this.position = 'absolute';
        this.zIndex = Agile$1.DEFAULT_DEPTH;
        if (this.id !== '') Agile$1.agileObjs[this.id] = this;

        this.x = 0;
        this.y = 0;
    }

    createClass(DisplayObject, [{
        key: 'createElement',
        value: function createElement() {
            this._avatar.id = IDUtils.generateID(this.toString());
            this.element = Css.createElement();
            Css.attr(this.element, 'id', this._avatar.id);
        }
    }, {
        key: 'background',
        value: function background(color) {
            if (color.indexOf('.') > 0) this.backgroundImage = color;else this.color = color;
        }
    }, {
        key: 'getRealWidth',
        value: function getRealWidth() {
            if (!this._avatar.realWidth) this._avatar.realWidth = this.originalWidth;
            return this._avatar.realWidth * this.scaleX;
        }
    }, {
        key: 'getRealHeight',
        value: function getRealHeight() {
            if (!this._avatar.realHeight) this._avatar.realHeight = this.originalHeight;
            return this._avatar.realHeight * this.scaleY;
        }
    }, {
        key: 'css',
        value: function css(style, value) {
            if (this.element) return Css.css(this.element, style, value);
        }
    }, {
        key: 'css2',
        value: function css2(style, value) {
            if (this.element) return Css.css2(this.element, style, value);
        }
    }, {
        key: 'css3',
        value: function css3(style, value) {
            if (this.element) return Css.css3(this.element, style, value);
        }
    }, {
        key: 'css3j',
        value: function css3j(style, value) {
            if (this.element) Css.css3j(this.element, style, value);
        }
    }, {
        key: 'addClass',
        value: function addClass(styleName) {
            if (this.element) Css.addClass(this.element, styleName);
        }
    }, {
        key: 'removeClass',
        value: function removeClass(styleName) {
            if (this.element) Css.removeClass(this.element, styleName);
        }
    }, {
        key: 'addFrame',
        value: function addFrame(duration, frameObj, parmObj) {
            return Agile$1.Timeline.addFrame(this, duration, frameObj, parmObj);
        }
    }, {
        key: 'removeFrame',
        value: function removeFrame(frame, removeStyle) {
            return Agile$1.Timeline.removeFrame(this, frame, removeStyle);
        }
    }, {
        key: 'removeFrameAfter',
        value: function removeFrameAfter(frame, complete, removeStyle) {
            Agile$1.Timeline.removeFrameAfter(this, frame, complete, removeStyle);
        }
    }, {
        key: 'pause',
        value: function pause() {
            Agile$1.Timeline.pause(this);
        }
    }, {
        key: 'resume',
        value: function resume() {
            Agile$1.Timeline.resume(this);
        }
    }, {
        key: 'addChild',
        value: function addChild(child) {
            this._avatar.maxChildrenDepth++;
            child.zIndex = Agile$1.DEFAULT_DEPTH + this._avatar.maxChildrenDepth;

            if (child.parent !== this) {
                this.element.appendChild(child.element);
                this.numChildren++;
                this.childrens.push(child);
                child.parent = this;
                child.transform();

                if (!this._avatar.realWidth) this._avatar.realWidth = this.originalWidth;
                var left = Math.min(child.x - child.width * child.regX, -this.width * this.regX);
                this._avatar.realWidth += Math.abs(left + this.width * this.regX);

                var right = Math.max(child.x + child.width * (1 - child.regX), this.width * (1 - this.regX));
                this._avatar.realWidth += right - this.width * (1 - this.regX);

                if (!this._avatar.realHeight) this._avatar.realHeight = this.originalHeight;
                var top = Math.min(child.y - child.height * child.regY, -this.height * this.regY);
                this._avatar.realHeight += Math.abs(top + this.height * this.regY);

                var bottom = Math.max(child.y + child.height * (1 - child.regY), this.height * (1 - this.regY));
                this._avatar.realHeight += bottom - this.height * (1 - this.regY);
            }

            return child;
        }
    }, {
        key: 'addChildAt',
        value: function addChildAt(child, index) {
            this.addChild(child);
            child.zIndex = index;
        }
    }, {
        key: 'removeChild',
        value: function removeChild(child) {
            if (child.parent === this) {
                this.element.removeChild(child.element);
                this.numChildren--;
                Utils.arrayRemove(this.childrens, child);

                child.zIndex = Agile$1.DEFAULT_DEPTH;
                child.parent = null;
                child.transform();
            }
        }
    }, {
        key: 'addFilter',
        value: function addFilter(filter) {
            this.filters.push(filter);
            filter.apply(this);
        }
    }, {
        key: 'removeFilter',
        value: function removeFilter(filter) {
            Utils.arrayRemove(this.filters, filter);
            filter.erase(this);
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(type, listener, useCapture) {
            this.element.addEventListener(type, listener, useCapture);
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener(type, listener, useCapture) {
            this.element.removeEventListener(type, listener, useCapture);
        }
    }, {
        key: 'transform',
        value: function transform() {
            var parentOffsetX = void 0,
                parentOffsetY = void 0,
                thisOffsetX = void 0,
                thisOffsetY = void 0,
                translate = void 0,
                rotate = void 0,
                scale = void 0,
                skew = void 0;

            if (Agile$1.mode === '3d' && Agile$1.support3d) {
                parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth : 0;
                parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight : 0;
                thisOffsetX = this.regX * this.originalWidth;
                thisOffsetY = this.regY * this.originalHeight;
                translate = 'translate3d(' + (this.x - thisOffsetX + parentOffsetX) + 'px,' + (this.y - thisOffsetY + parentOffsetY) + 'px,' + this.z + 'px) ';
                rotate = 'rotateX(' + this.rotationX + 'deg) ' + 'rotateY(' + this.rotationY + 'deg) ' + 'rotateZ(' + this.rotationZ + 'deg) ';
                scale = 'scale3d(' + this.scaleX + ',' + this.scaleY + ',' + this.scaleZ + ') ';
                skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';

                this.css3('transform', translate + rotate + scale + skew);
            } else {
                parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth : 0;
                parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight : 0;
                thisOffsetX = this.regX * this.originalWidth;
                thisOffsetY = this.regY * this.originalHeight;
                translate = 'translate(' + (this.x - thisOffsetX + parentOffsetX) + 'px,' + (this.y - thisOffsetY + parentOffsetY) + 'px) ';
                rotate = 'rotate(' + this.rotationZ + 'deg) ';
                scale = 'scale(' + this.scaleX + ',' + this.scaleY + ') ';
                skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';

                this.css3('transform', translate + rotate + scale + skew);
            }
        }
    }, {
        key: 'touchStart',
        value: function touchStart(fun) {
            this.touchStartHandler = function (e) {
                var x = e['targetTouches'] ? e['targetTouches'][0].pageX : e.pageX;
                var y = e['targetTouches'] ? e['targetTouches'][0].pageY : e.pageY;
                fun(x, y, e);
            };

            var events = !Utils.isMobile() ? 'mousedown' : 'touchstart';
            this.element.addEventListener(events, this.touchStartHandler);
        }
    }, {
        key: 'stopTouchStart',
        value: function stopTouchStart() {
            if (this.touchStartHandler) {
                var events = !Utils.isMobile() ? 'mousedown' : 'touchstart';
                this.element.removeEventListener(events, this.touchStartHandler);
                this.touchStartHandle = null;
            }
        }
    }, {
        key: 'touchMove',
        value: function touchMove(fun) {
            this.touchMoveHandler = function (e) {
                var x = e['targetTouches'] ? e['targetTouches'][0].pageX : e.pageX;
                var y = e['targetTouches'] ? e['targetTouches'][0].pageY : e.pageY;
                fun(x, y, e);
            };

            var events = !Utils.isMobile() ? 'mousemove' : 'touchmove';
            this.element.addEventListener(events, this.touchMoveHandler);
        }
    }, {
        key: 'stopTouchMove',
        value: function stopTouchMove() {
            if (this.touchMoveHandler) {
                var events = !Utils.isMobile() ? 'mousemove' : 'touchmove';
                this.element.removeEventListener(events, this.touchMoveHandler);
                this.touchMoveHandler = null;
            }
        }
    }, {
        key: 'touchEnd',
        value: function touchEnd(fun) {
            this.touchEndHandler = function (e) {
                fun(e);
            };

            var events = !Utils.isMobile() ? 'mouseup' : 'touchend';
            this.element.addEventListener(events, this.touchEndHandler);
        }
    }, {
        key: 'stopTouchEnd',
        value: function stopTouchEnd() {
            if (this.touchEndHandler) {
                var events = !Utils.isMobile() ? 'mouseup' : 'touchend';
                this.element.removeEventListener(events, this.touchEndHandler);
                this.touchEndHandler = null;
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            for (var i = 0; i < this.childrens.length; i++) {
                this.childrens[i].destroy();
            }Utils.destroyObject(this.childrens);
            delete Agile$1.agileObjs[this.id];

            this.parent = null;
            this.filters = null;

            Agile$1.Timeline.kill(this);
            Agile$1.Tween.killTweensOf(this);
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'DisplayObject';
        }
    }, {
        key: 'id',
        set: function set$$1(id) {
            this._avatar.id = id;
            Css.attr(this.element, 'id', this._avatar.id);
        },
        get: function get$$1() {
            return this._avatar.id;
        }
    }, {
        key: 'x',
        set: function set$$1(x) {
            this._avatar.x = x;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.x;
        }
    }, {
        key: 'y',
        set: function set$$1(y) {
            this._avatar.y = y;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.y;
        }
    }, {
        key: 'z',
        set: function set$$1(z) {
            this._avatar.z = z;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.z;
        }
    }, {
        key: 'scaleX',
        set: function set$$1(scaleX) {
            this._avatar.scaleX = scaleX;
            this._avatar.width = scaleX * this.originalWidth;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.scaleX;
        }
    }, {
        key: 'scaleY',
        set: function set$$1(scaleY) {
            this._avatar.scaleY = scaleY;
            this._avatar.height = scaleY * this.originalHeight;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.scaleY;
        }
    }, {
        key: 'scaleZ',
        set: function set$$1(scaleZ) {
            this._avatar.scaleZ = scaleZ;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.scaleZ;
        }
    }, {
        key: 'skewX',
        set: function set$$1(skewX) {
            this._avatar.skewX = skewX;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.skewX;
        }
    }, {
        key: 'skewY',
        set: function set$$1(skewY) {
            this._avatar.skewY = skewY;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.skewY;
        }
    }, {
        key: 'rotationX',
        set: function set$$1(rotationX) {
            this._avatar.rotationX = rotationX;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.rotationX;
        }
    }, {
        key: 'rotationY',
        set: function set$$1(rotationY) {
            this._avatar.rotationY = rotationY;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.rotationY;
        }
    }, {
        key: 'rotationZ',
        set: function set$$1(rotationZ) {
            this._avatar.rotationZ = rotationZ;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.rotationZ;
        }
    }, {
        key: 'rotation',
        set: function set$$1(rotation) {
            this._avatar.rotationZ = rotation;
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.rotationZ;
        }
    }, {
        key: 'regX',
        set: function set$$1(regX) {
            this._avatar.regX = regX;
            var regx = parseFloat(this.regX) * 100 + '%';
            var regy = parseFloat(this.regY) * 100 + '%';
            this.css3('transformOrigin', regx + ' ' + regy);
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.regX;
        }
    }, {
        key: 'regY',
        set: function set$$1(regY) {
            this._avatar.regY = regY;
            var regx = parseFloat(this.regX) * 100 + '%';
            var regy = parseFloat(this.regY) * 100 + '%';

            this.css3('transformOrigin', regx + ' ' + regy);
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.regY;
        }
    }, {
        key: 'regZ',
        set: function set$$1(regZ) {
            this._avatar.regZ = regZ;
            var regx = parseFloat(this.regX) * 100 + '%';
            var regy = parseFloat(this.regY) * 100 + '%';
            var regz = parseFloat(this.regZ) * 100 + '%';

            this.css3('transformOrigin', regx + ' ' + regy + ' ' + regz);
            this.transform();
        },
        get: function get$$1() {
            return this._avatar.regZ;
        }
    }, {
        key: 'originalWidth',
        set: function set$$1(originalWidth) {
            this._avatar.originalWidth = originalWidth;
            this.css2('width', this.originalWidth + 'px');
        },
        get: function get$$1() {
            return this._avatar.originalWidth;
        }
    }, {
        key: 'originalHeight',
        set: function set$$1(originalHeight) {
            this._avatar.originalHeight = originalHeight;
            this.css2('height', this.originalHeight + 'px');
        },
        get: function get$$1() {
            return this._avatar.originalHeight;
        }
    }, {
        key: 'width',
        set: function set$$1(width) {
            if (!this.originalWidth) {
                this._avatar.width = width;
                this.originalWidth = width;
            } else {
                this.scaleX = width / this.originalWidth;
            }
        },
        get: function get$$1() {
            return this._avatar.width;
        }
    }, {
        key: 'height',
        set: function set$$1(height) {
            if (!this.originalHeight) {
                this._avatar.height = height;
                this.originalHeight = height;
            } else {
                this.scaleY = height / this.originalHeight;
            }
        },
        get: function get$$1() {
            return this._avatar.height;
        }
    }, {
        key: 'visible',
        set: function set$$1(visible) {
            this._avatar.visible = visible;
            var vis = visible ? 'block' : 'none';
            this.css2('display', vis);
        },
        get: function get$$1() {
            return this._avatar.visible;
        }
    }, {
        key: 'alpha',
        set: function set$$1(alpha) {
            this._avatar.alpha = alpha;
            this.css2('opacity', this.alpha);
        },
        get: function get$$1() {
            return this._avatar.alpha;
        }
    }, {
        key: 'color',
        set: function set$$1(color) {
            if (color === 'random' || color === '#random') color = Color$1.randomColor();
            this._avatar.color = color;

            if (color.indexOf('gradient') > -1) this.css3j('background', this.color);else this.css2('backgroundColor', this.color);
        },
        get: function get$$1() {
            return this._avatar.color;
        }
    }, {
        key: 'backgroundImage',
        set: function set$$1(backgroundImage) {
            this._avatar.backgroundImage = backgroundImage;

            var img = backgroundImage !== null || backgroundImage !== undefined ? 'url(' + this.backgroundImage + ')' : null;
            this.css2('backgroundImage', img);
        },
        get: function get$$1() {
            return this._avatar.backgroundImage;
        }
    }, {
        key: 'position',
        set: function set$$1(position) {
            this._avatar.position = position;
            this.css2('position', this.position);
        },
        get: function get$$1() {
            return this._avatar.position;
        }
    }, {
        key: 'zIndex',
        set: function set$$1(zIndex) {
            this._avatar.zIndex = zIndex;
            this.css2('zIndex', this.zIndex);
        },
        get: function get$$1() {
            return this._avatar.zIndex;
        }
    }, {
        key: 'mask',
        set: function set$$1(mask) {
            if ((mask + '').indexOf('gradient') > -1) {
                this.css3('maskImage', mask);
            } else {
                mask = mask ? 'url(' + mask + ')' : null;
                this.css3('maskImage', mask);
            }
        }
    }, {
        key: 'select',
        set: function set$$1(select) {
            select = select === false || select === null ? 'none' : 'auto';
            this.css3('userSelect', select);
        }
    }, {
        key: 'cursor',
        set: function set$$1(cursor) {
            cursor = cursor === true || cursor === 'hand' || cursor === 'pointer' ? 'pointer' : 'auto';
            this.css2('cursor', cursor);
        },
        get: function get$$1() {
            return this.css2('cursor');
        }
    }, {
        key: 'backface',
        set: function set$$1(backface) {
            this._avatar.backface = backface;
            var bf = backface ? 'visible' : 'hidden';
            this.css3('backfaceVisibility', bf);
        },
        get: function get$$1() {
            return this._avatar.backface;
        }
    }]);
    return DisplayObject;
}();

var Circle = function (_DisplayObject) {
	inherits(Circle, _DisplayObject);

	function Circle() {
		var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 25;
		var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'purple';
		classCallCheck(this, Circle);

		var _this = possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this));

		_this.radius = radius;
		_this.background(color);
		return _this;
	}

	createClass(Circle, [{
		key: 'toString',
		value: function toString() {
			return 'Circle';
		}
	}, {
		key: 'radius',
		get: function get$$1() {
			return this._avatar.radius;
		},
		set: function set$$1(radius) {
			this._avatar.radius = radius;
			this.width = this.height = this.radius * 2;
			this.css3('borderRadius', '50%');
		}
	}]);
	return Circle;
}(DisplayObject);

var Dom = function (_DisplayObject) {
	inherits(Dom, _DisplayObject);

	function Dom(dom, resetPosition) {
		classCallCheck(this, Dom);

		var _this = possibleConstructorReturn(this, (Dom.__proto__ || Object.getPrototypeOf(Dom)).call(this));

		if (dom === '3d' || dom === '2d') return possibleConstructorReturn(_this);

		if (typeof dom === 'string') _this.element = Css.select(dom);else if (dom['jquery']) _this.element = dom[0];else _this.element = dom;

		var id = Css.attr(_this.element, 'id');
		_this._avatar.id = id ? id : IDUtils.generateID(_this.toString());

		_this._avatar.width = parseFloat(_this.css2('width')) || 0;
		_this._avatar.height = parseFloat(_this.css2('height')) || 0;
		_this._avatar.position = _this.css2('position') || 'absolute';
		_this._avatar.zIndex = _this.css2('zIndex') || 0;
		_this._avatar.display = _this.css2('display') || 'block';
		_this._avatar.color = _this.css2('backgroundColor');
		_this._avatar.backgroundImage = _this.css2('backgroundImage');
		_this._avatar.alpha = _this.css2('opacity') === '' || _this.css2('opacity') === undefined ? 1 : _this.css2('opacity');

		if (_this._avatar.display !== 'none') _this._avatar.defalutDisplay = _this._avatar.display;

		_this.transform();

		Agile.agileObjs[_this.id] = _this;
		if (resetPosition) _this.resetPosition();
		return _this;
	}

	createClass(Dom, [{
		key: 'createElement',
		value: function createElement() {
			// null
		}
	}, {
		key: 'resetPosition',
		value: function resetPosition() {
			this.originalWidth = this.width;
			this.originalHeight = this.height;
		}
	}, {
		key: 'toString',
		value: function toString() {
			return 'Dom';
		}
	}, {
		key: 'visible',
		get: function get$$1() {
			return this._avatar.visible;
		},
		set: function set$$1(visible) {
			this._avatar.visible = visible;
			var defalutDisplay = this._avatar.defalutDisplay ? this._avatar.defalutDisplay : 'block';
			var vis = visible ? defalutDisplay : 'none';
			this.css2('display', vis);
		}
	}]);
	return Dom;
}(DisplayObject);

var Container = function (_Dom) {
	inherits(Container, _Dom);

	function Container() {
		var dom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '2d';
		var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '2d';
		classCallCheck(this, Container);

		var _this = possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, dom));

		if (dom && dom !== '3d' && dom !== '2d') {
			_this._avatar.dom = dom;
		}

		_this._avatar.mode = '2d';
		_this._avatar.regX = Utils.getCssValue(_this, 'transformOrigin', 0, 3) || .5;
		_this._avatar.regY = Utils.getCssValue(_this, 'transformOrigin', 1, 3) || .5;

		_this._avatar.perspectiveOriginX = .5;
		_this._avatar.perspectiveOriginY = .5;
		_this._avatar.perspectiveOriginZ = 0;

		if (dom === '3d' || mode === '3d') _this.mode = '3d';else _this.mode = '2d';

		Agile$1.containers.push(_this);
		return _this;
	}

	createClass(Container, [{
		key: 'createElement',
		value: function createElement() {
			if (this.dom) return this.dom;

			this._avatar.id = IDUtils.generateID(this.toString());
			this.element = Css.createElement();
			Css.attr(this.element, 'id', this._avatar.id);
		}
	}, {
		key: 'addChild',
		value: function addChild(obj) {
			get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'addChild', this).call(this, obj);
			obj.backface = this.backface;

			if (Agile$1.backface === false) obj.backface = false;
		}
	}, {
		key: 'toString',
		value: function toString() {
			return 'Container';
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), 'destroy', this).call(this);
			Utils.arrayRemove(Agile$1.containers, this);
		}
	}, {
		key: 'mode',
		get: function get$$1() {
			return this._avatar.mode;
		},
		set: function set$$1(mode) {
			this._avatar.mode = mode;
			mode = mode === '2d' ? 'flat' : 'preserve-3d';
			this.css3('transformStyle', mode);
		}
	}, {
		key: 'perspective',
		get: function get$$1() {
			return this._avatar.perspective;
		},
		set: function set$$1(perspective) {
			this._avatar.perspective = perspective;
			this.css3('perspective', perspective + 'px');
		}
	}, {
		key: 'perspectiveOriginX',
		get: function get$$1() {
			return this._avatar.perspectiveOriginX;
		},
		set: function set$$1(perspectiveOriginX) {
			this._avatar.perspectiveOriginX = perspectiveOriginX;
			perspectiveOriginX = this.perspectiveOriginX * 100 + '%';
			perspectiveOriginY = this.perspectiveOriginY * 100 + '%';

			this.css3('perspectiveOrigin', perspectiveOriginX + ' ' + perspectiveOriginY);
		}
	}, {
		key: 'perspectiveOriginY',
		get: function get$$1() {
			return this._avatar.perspectiveOriginY;
		},
		set: function set$$1(perspectiveOriginY) {
			this._avatar.perspectiveOriginY = perspectiveOriginY;
			perspectiveOriginX = this.perspectiveOriginX * 100 + '%';
			perspectiveOriginY = this.perspectiveOriginY * 100 + '%';

			this.css3('perspectiveOrigin', perspectiveOriginX + ' ' + perspectiveOriginY);
		}
	}, {
		key: 'perspectiveOriginZ',
		get: function get$$1() {
			return this._avatar.perspectiveOriginZ;
		},
		set: function set$$1(perspectiveOriginZ) {
			this._avatar.perspectiveOriginZ = perspectiveOriginZ;
			perspectiveOriginX = this.perspectiveOriginX * 100 + '%';
			perspectiveOriginY = this.perspectiveOriginY * 100 + '%';
			perspectiveOriginZ = this.perspectiveOriginZ + 'px';

			this.css3('perspectiveOrigin', perspectiveOriginX + ' ' + perspectiveOriginY + ' ' + perspectiveOriginZ);
		}
	}]);
	return Container;
}(Dom);

var Ellipse = function (_DisplayObject) {
	inherits(Ellipse, _DisplayObject);

	function Ellipse() {
		var radiusX = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
		var radiusY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;
		var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'purple';
		classCallCheck(this, Ellipse);

		var _this = possibleConstructorReturn(this, (Ellipse.__proto__ || Object.getPrototypeOf(Ellipse)).call(this));

		_this.radiusX = radiusX;
		_this.radiusY = radiusY;

		_this.background(color);
		_this.x = _this.y = 0;
		return _this;
	}

	createClass(Ellipse, [{
		key: 'toString',
		value: function toString() {
			return 'Ellipse';
		}
	}, {
		key: 'radiusX',
		get: function get$$1() {
			return this._avatar.radiusX;
		},
		set: function set$$1(radiusX) {
			this._avatar.radiusX = radiusX;
			this.width = this.radiusX * 2;
			this.css3('borderRadius', this.radiusX + 'px' + ' / ' + this.radiusY + 'px');
		}
	}, {
		key: 'radiusY',
		get: function get$$1() {
			return this._avatar.radiusY;
		},
		set: function set$$1(radiusY) {
			this._avatar.radiusY = radiusY;
			this.height = this.radiusY * 2;
			this.css3('borderRadius', this.radiusX + 'px' + ' / ' + this.radiusY + 'px');
		}
	}]);
	return Ellipse;
}(DisplayObject);

var AgileImage = function (_DisplayObject) {
	inherits(AgileImage, _DisplayObject);

	function AgileImage(image, width, height) {
		classCallCheck(this, AgileImage);

		var _this = possibleConstructorReturn(this, (AgileImage.__proto__ || Object.getPrototypeOf(AgileImage)).call(this));

		_this.x = 0;
		_this.y = 0;
		_this.delayEventTime = 5;

		if (image) {
			if (typeof image === 'string') {
				var reg = new RegExp('ftp|http|png|jpg|jpeg|gif');
				if (reg.test(image)) _this.image = image;else _this.setClassImage(image);
			} else {
				_this.image = image;
			}
		}

		if (width) _this.width = width;
		if (height) _this.height = height;
		return _this;
	}

	createClass(AgileImage, [{
		key: 'setClassImage',
		value: function setClassImage(className) {
			var _this2 = this;

			this.addClass(className);
			this.dispatchImageLoadedEvent(function () {
				_this2.width = parseFloat(_this2.css2('width')) || 0;
				_this2.height = parseFloat(_this2.css2('height')) || 0;
				_this2._avatar.backgroundImage = _this2.css2('backgroundImage');
			});
		}
	}, {
		key: 'dispatchImageLoadedEvent',
		value: function dispatchImageLoadedEvent(fun) {
			var _this3 = this;

			setTimeout(function () {
				if (fun) fun();

				var customEvent = void 0;
				try {
					customEvent = document.createEvent('CustomEvent');
					customEvent.initCustomEvent(Agile.IMAGE_LOADED, false, false);
					_this3.element.dispatchEvent(customEvent);
				} catch (e) {
					customEvent = document.createEvent('HTMLEvents');
					customEvent.initEvent(Agile.IMAGE_LOADED, false, false);
					_this3.element.dispatchEvent(customEvent);
				}

				_this3.loaded = true;
			}, this.delayEventTime);
		}
	}, {
		key: 'toString',
		value: function toString() {
			return 'AgileImage';
		}
	}, {
		key: 'originalWidth',
		get: function get$$1() {
			return this._avatar.originalWidth;
		},
		set: function set$$1(originalWidth) {
			this._avatar.originalWidth = originalWidth;
			this.css2('width', this.originalWidth + 'px');
			this.widthSize = true;
		}
	}, {
		key: 'originalHeight',
		get: function get$$1() {
			return this._avatar.originalHeight;
		},
		set: function set$$1(originalHeight) {
			this._avatar.originalHeight = originalHeight;
			this.css2('height', this.originalHeight + 'px');
			this.widthSize = true;
		}
	}, {
		key: 'image',
		get: function get$$1() {
			return this._avatar.image;
		},
		set: function set$$1(image) {
			var _this4 = this;

			this.loaded = false;
			this._avatar.image = Agile.LoadManager.getImage(image, function (imgObj) {
				if (!_this4.widthSize) {
					_this4._avatar.width = imgObj.width;
					_this4._avatar.originalWidth = imgObj.width;
					_this4.css2('width', imgObj.width + 'px');
				}

				if (!_this4.heightSize) {
					_this4._avatar.height = imgObj.height;
					_this4._avatar.originalHeight = imgObj.height;
					_this4.css2('height', imgObj.height + 'px');
				}

				_this4.backgroundImage = imgObj.src;
				_this4.transform();
				_this4.dispatchImageLoadedEvent();
			});
		}
	}]);
	return AgileImage;
}(DisplayObject);

var Line = function (_DisplayObject) {
	inherits(Line, _DisplayObject);

	function Line() {
		var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
		var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'blue';
		classCallCheck(this, Line);

		var _this = possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).call(this));

		_this.regX = 0;
		_this.regY = 0;
		_this._avatar.fromX = 0;
		_this._avatar.fromY = 0;
		_this.size = size;
		_this.color = color;

		_this.x = _this.y = 0;
		_this.lines = [];
		return _this;
	}

	createClass(Line, [{
		key: 'moveTo',
		value: function moveTo(x, y) {
			this._avatar.fromX = x;
			this._avatar.fromY = y;
		}
	}, {
		key: 'lineTo',
		value: function lineTo(x, y) {
			var x1 = this._avatar.fromX;
			var y1 = this._avatar.fromY;

			var length = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
			var angle = Math.atan2(y - y1, x - x1) * 180 / Math.PI;
			var line = Css.createElement();

			Css.css(line, {
				'backgroundColor': this.color,
				'width': length + 'px',
				'height': this.size + 'px',
				'position': 'absolute'
			});

			var translate = void 0,
			    rotate = void 0;
			if (Agile.mode === '3d') {
				translate = 'translate3d(' + this._avatar.fromX + 'px,' + this._avatar.fromY + 'px,0px) ';
				rotate = 'rotateZ(' + angle + 'deg)';
			} else {
				translate = 'translate(' + this._avatar.fromX + 'px,' + this._avatar.fromY + 'px) ';
				rotate = 'rotate(' + angle + 'deg)';
			}

			Css.css3(line, 'transformOrigin', 'left center');
			Css.css3(line, 'transform', translate + rotate);
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
	}, {
		key: 'curveTo',
		value: function curveTo(x, y) {
			var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;

			var x1 = this._avatar.fromX;
			var y1 = this._avatar.fromY;

			var length = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
			var tha = Math.PI / 4;
			length /= .707;
			length -= 4 * this.size;

			var angle = Math.atan2(y - y1, x - x1) * 180 / Math.PI;
			var line = Css.createElement();
			var w = length;
			var h = length;
			var size = Math.max(Math.abs(this.size / s), 1);

			Css.css(line, {
				'width': w + 'px',
				'height': h + 'px',
				'position': 'absolute'
			});

			Css.css(line, {
				'borderStyle': 'solid',
				'borderTopColor': this.color,
				'borderRightColor': 'transparent',
				'borderLeftColor': 'transparent',
				'borderBottomColor': 'transparent',
				'borderWidth': size + 'px'
			}, 3);

			var offsetX = w / 2 * (1 - Math.cos(tha));
			var offsetY = h / 2 * (1 - Math.sin(tha));

			var translate = void 0,
			    rotate = void 0,
			    scale = void 0;
			if (Agile.mode === '3d') {
				translate = 'translate3d(' + (this._avatar.fromX - offsetX) + 'px,' + (this._avatar.fromY - offsetY) + 'px,0px) ';
				rotate = 'rotateZ(' + angle + 'deg) ';
				scale = 'scale3d(1,' + s + ',1)';
			} else {
				translate = 'translate(' + (this._avatar.fromX - offsetX) + 'px,' + (this._avatar.fromY - offsetY) + 'px) ';
				rotate = 'rotate(' + angle + 'deg)';
				scale = 'scale(1,' + s + ')';
			}

			Css.css3(line, 'transformOrigin', offsetX * 100 / w + '% ' + offsetY * 100 / w + '%');
			Css.css3(line, 'transform', translate + rotate + scale);
			Css.css3(line, 'borderRadius', '50% 50%');
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
	}, {
		key: 'clear',
		value: function clear() {
			for (var i = 0, length = this.lines.length; i < length; i++) {
				this.element.removeChild(this.lines[i]);
				this.lines[i] = null;
			}

			this.lines.length = 0;
		}
	}, {
		key: 'toString',
		value: function toString() {
			return 'Line';
		}
	}, {
		key: 'color',
		get: function get$$1() {
			return this._avatar.color;
		},
		set: function set$$1(color) {
			this._avatar.color = color;
		}
	}, {
		key: 'size',
		get: function get$$1() {
			return this._avatar.size;
		},
		set: function set$$1(size) {
			this._avatar.size = size;
		}
	}]);
	return Line;
}(DisplayObject);

var JsonUtils = {
	object2Json: function object2Json(obj) {
		var t = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);

		if (t !== 'object' || obj === null) {
			if (t === 'string') obj = '' + obj + '';
			return String(obj);
		} else {
			var n = void 0,
			    v = void 0;
			var json = [];
			var isArr = Utils.isArray(obj);

			for (n in obj) {
				v = obj[n];
				t = typeof v === 'undefined' ? 'undefined' : _typeof(v);
				if (t === 'string') {
					// v = ''' + v + ''';
				} else {
					if (t === 'object' && v !== null) {
						v = this.object2Json(v);
					}
				}

				json.push((isArr ? '' : '' + n + ':') + String(v));
			}
			var j = json.join('; ');

			return (isArr ? '[' : '{') + j + (isArr ? ']' : '}');
		}
	},
	object2String: function object2String(obj) {
		var str = '';
		for (var index in obj) {
			str += obj[index] + ', ';
		}str = str.substr(0, str.length - 2);
		return str;
	},
	replaceChart: function replaceChart(json) {
		return json.replace(new RegExp('%:', 'g'), '%').replace(new RegExp('};', 'g'), '}');
	}
};

var Keyframes = function () {
	function Keyframes() {
		classCallCheck(this, Keyframes);

		this.keyframes = { '100%': {} };

		this.label = IDUtils.generateID(this.toString());

		for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
			rest[_key] = arguments[_key];
		}

		this.add.apply(this, rest);
	}

	/*
  * myKeyframes.add({time:15, color:'#000', x:2}, {time:25, color:'#fff'});
  * myKeyframes.add(30, { color: '#ccc' });
  * myKeyframes.add(60, alpha, 0);
  * myKeyframes.add('20%', alpha, 1);
  */


	createClass(Keyframes, [{
		key: 'add',
		value: function add() {
			if (!arguments.length) return;

			if (_typeof(arguments.length <= 0 ? undefined : arguments[0]) === 'object') {
				var keyframe = arguments.length <= 0 ? undefined : arguments[0];

				for (var key in keyframe) {
					var timevalue = keyframe[key];
					var time = void 0;

					if (Utils.isNumber(key)) {
						time = key + '%';
					} else {
						time = key.indexOf('%') > -1 ? key : key + '%';
					}

					delete keyframe['' + key];
					keyframe[time] = timevalue;
					this.setColor(keyframe[time]);
				}

				Object.assign(this.keyframes, keyframe);
			} else {
				var _time = Utils.isNumber(arguments.length <= 0 ? undefined : arguments[0]) ? (arguments.length <= 0 ? undefined : arguments[0]) + '%' : arguments.length <= 0 ? undefined : arguments[0];
				var _keyframe = {};
				var style = void 0;
				var value = void 0;

				if (arguments.length === 3) {
					style = arguments.length <= 1 ? undefined : arguments[1];
					value = arguments.length <= 2 ? undefined : arguments[2];

					_keyframe[_time] = {};
					_keyframe[_time][style] = value;
				} else {
					value = arguments.length <= 1 ? undefined : arguments[1];
					_keyframe[_time] = value;
				}

				this.setColor(_keyframe[_time]);
				Object.assign(this.keyframes, _keyframe);
			}

			this.fill();
		}
	}, {
		key: 'get',
		value: function get$$1(time) {
			if (Utils.isNumber(time)) time = time + '%';
			return this.keyframes[time];
		}
	}, {
		key: 'remove',
		value: function remove(time) {
			time = Utils.isNumber(time) ? time + '%' : time;
			if (time) delete this.keyframes[time];else this.destroy();
		}
	}, {
		key: 'fill',
		value: function fill() {
			this.sort();
			var prevValue = void 0;

			for (var time in this.keyframes) {
				var frame = this.keyframes[time];

				for (var key in prevValue) {
					if (frame[key] === undefined) frame[key] = prevValue[key];
				}

				prevValue = frame;
			}
		}
	}, {
		key: 'sort',
		value: function sort() {
			var cloneObj = {};
			var keys = Utils.keys(this.keyframes);
			keys.sort(function (a, b) {
				return parseFloat(a) - parseFloat(b);
			});

			for (var i = 0, len = keys.length; i < len; i++) {
				var k = keys[i];
				cloneObj[k] = this.keyframes[k];
			}

			this.keyframes = cloneObj;
			return this.keyframes;
		}
	}, {
		key: 'merge',
		value: function merge() {
			var obj = {};

			for (var time in this.keyframes) {
				for (var key in this.keyframes[time]) {
					obj[key] = this.keyframes[time][key];
				}
			}

			return obj;
		}
	}, {
		key: 'setColor',
		value: function setColor(obj) {
			if (obj.color) {
				if (obj.color === 'random') obj.color = Color$1.randomColor();
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			Utils.destroyObject(this.keyframes);
		}
	}, {
		key: 'toString',
		value: function toString() {
			return 'Keyframes';
		}
	}]);
	return Keyframes;
}();

var Avatar = function (_DisplayObject) {
	inherits(Avatar, _DisplayObject);

	function Avatar() {
		var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
		var height = arguments[1];
		var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'blur';
		classCallCheck(this, Avatar);

		var _this = possibleConstructorReturn(this, (Avatar.__proto__ || Object.getPrototypeOf(Avatar)).call(this));

		_this.width = width;
		_this.height = height || _this.width;

		_this.background(color);
		_this.x = _this.y = 0;

		_this.parent = {
			originalWidth: 0,
			originalHeight: 0,
			regX: 0,
			regY: 0
		};
		return _this;
	}

	createClass(Avatar, [{
		key: 'clearStyle',
		value: function clearStyle() {
			this.css3('transform', '');
			this.element.style.cssText = '';
			this.element.style = '';
		}
	}, {
		key: 'copyParent',
		value: function copyParent(parent) {
			this.parent.regX = parent.regX;
			this.parent.regY = parent.regY;
			this.parent.originalWidth = parent.originalWidth;
			this.parent.originalHeight = parent.originalHeight;
		}
	}, {
		key: 'copySelf',
		value: function copySelf(self, copyAll) {
			this.regX = self.regX;
			this.regY = self.regY;
			this.originalWidth = self.originalWidth;
			this.originalHeight = self.originalHeight;

			if (self.parent) this.copyParent(self.parent);

			if (copyAll) {
				this.x = self.x;
				this.y = self.y;
				this.z = self.z;

				this.scaleX = self.scaleX;
				this.scaleY = self.scaleY;
				this.scaleZ = self.scaleZ;

				this.rotation = self.rotation;
				this.rotationX = self.rotationX;
				this.rotationY = self.rotationY;
				this.rotationZ = self.rotationZ;

				this.skewX = self.skewX;
				this.skewY = self.skewY;
			}
		}
	}, {
		key: 'toString',
		value: function toString() {
			return 'Avatar';
		}
	}]);
	return Avatar;
}(DisplayObject);

var Text = function (_DisplayObject) {
	inherits(Text, _DisplayObject);

	function Text() {
		var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
		var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 18;
		var align = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'left';
		var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#000';
		classCallCheck(this, Text);

		var _this = possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this));

		_this.text = text;
		_this.size = size;
		_this.color = color;
		_this.align = align;
		_this.x = _this.y = 0;
		_this.regX = _this.regY = 0;
		return _this;
	}

	createClass(Text, [{
		key: 'toString',
		value: function toString() {
			return 'Text';
		}
	}, {
		key: 'height',
		get: function get$$1() {
			return parseFloat(this.css2('height')) || 0;
		},
		set: function set$$1(height) {
			this._avatar.height = height;

			if (!this.originalHeight) this.originalHeight = height;else this.scaleY = this.height / this.originalHeight;
		}
	}, {
		key: 'width',
		get: function get$$1() {
			return parseFloat(this.css2('width')) || 0;
		},
		set: function set$$1(width) {
			this._avatar.width = width;
			if (!this.originalWidth) this.originalWidth = width;else this.scaleX = this.width / this.originalWidth;
		}
	}, {
		key: 'text',
		set: function set$$1(text) {
			this._avatar.text = text;
			if (typeof this.element.textContent === 'string') {
				this.element.textContent = this.text;
			} else {
				this.element.innerText = this.text;
			}
		},
		get: function get$$1() {
			return this._avatar.text;
		}
	}, {
		key: 'htmlText',
		set: function set$$1(htmlText) {
			this._avatar.text = htmlText;
			this.element.innerHTML = this.htmlText;
		},
		get: function get$$1() {
			return this._avatar.text;
		}
	}, {
		key: 'align',
		set: function set$$1(align) {
			this._avatar.align = align;
			this.css2('textAlign', this.align);
		},
		get: function get$$1() {
			return this._avatar.align;
		}
	}, {
		key: 'color',
		set: function set$$1(color) {
			this._avatar.color = color;
			this.css2('color', this.color);
		},
		get: function get$$1() {
			return this._avatar.color;
		}
	}, {
		key: 'size',
		set: function set$$1(size) {
			this._avatar.size = size;
			this.css2('fontSize', this.size + 'px');
		},
		get: function get$$1() {
			return this._avatar.size;
		}
	}, {
		key: 'font',
		set: function set$$1(font) {
			this._avatar.font = font;
			this.css2('fontFamily', this.font);
		},
		get: function get$$1() {
			return this._avatar.font;
		}
	}, {
		key: 'weight',
		set: function set$$1(weight) {
			this._avatar.weight = weight;
			this.css2('fontWeight', this.weight);
		},
		get: function get$$1() {
			return this._avatar.weight;
		}
	}, {
		key: 'smooth',
		set: function set$$1(smooth) {
			if (smooth) this.css3('fontSmoothing', 'antialiased !important');else this.css3('fontSmoothing', null);
		}
	}]);
	return Text;
}(DisplayObject);

var Timeline = {
	index: 0,
	callbacks: {},
	currentTime: 0,
	nextTween: [],
	replace: false,
	remove: true,

	get avatar() {
		if (!this.avatarmc) this.avatarmc = new Avatar(1, 1);
		return this.avatarmc;
	},

	addFrame: function addFrame(agile, duration, frameObj, paramsObj) {
		var keyframe = void 0;

		if (frameObj instanceof Keyframes) {
			if (!paramsObj) paramsObj = {};

			this.insertKeyframes(agile, frameObj, paramsObj['replace']);
			this.apply(agile, duration, frameObj, paramsObj);
		} else if ((typeof frameObj === 'undefined' ? 'undefined' : _typeof(frameObj)) === 'object') {
			if (frameObj.hasOwnProperty('frame')) keyframe = frameObj['frame'];else keyframe = paramsObj;

			this.insertKeyframes(agile, keyframe, frameObj['replace']);
			this.apply(agile, duration, keyframe, frameObj);
		}

		return this.index++;
	},
	playFrame: function playFrame(agile, duration, frameObj, paramsObj) {
		var keyframe = void 0;

		if (frameObj instanceof Keyframes) {
			if (!paramsObj) paramsObj = {};
			this.apply(agile, duration, frameObj, paramsObj);
		} else if ((typeof frameObj === 'undefined' ? 'undefined' : _typeof(frameObj)) === 'object') {
			if (frameObj.hasOwnProperty('frame')) keyframe = frameObj['frame'];else keyframe = paramsObj;

			this.apply(agile, duration, keyframe, frameObj);
		}

		return this.index++;
	},
	insertKeyframes: function insertKeyframes(agile, keyframes, replace) {
		if (replace || this.replace) this.removeKeyframes(agile.id + '_' + keyframes.label);

		var prefix = Css.getPrefix(2);
		this.avatar.clearStyle();
		this.avatar.copySelf(agile, 'all');

		var keys = {};
		for (var time in keyframes.keyframes) {
			var timeObj = keyframes.keyframes[time];
			keys[time] = {};

			for (var style in timeObj) {
				var newIndex = '_' + style + '_';
				var i = Agile.keyword.search(new RegExp(newIndex, 'i'));

				if (i <= -1) {
					if (style.indexOf('-') > -1) {
						var arr = style.split('-');
						for (var _i = 0; _i < arr.length; _i++) {
							if (_i !== 0) arr[_i] = arr[_i].charAt(0).toUpperCase() + arr[_i].substr(1);
						}

						this.avatar.css2(arr.join(''), timeObj[style]);
					} else {
						this.avatar.css2(style, timeObj[style]);
					}
				} else {
					this.avatar[style] = timeObj[style];
				}

				switch (style) {
					case 'alpha':
						keys[time]['opacity'] = this.avatar[style];
						break;

					case 'color':
						if (!(agile instanceof Text)) {
							keys[time]['background-color'] = this.avatar[style];
						}
						break;

					case 'x':
					case 'y':
					case 'z':
					case 'scaleX':
					case 'scaleY':
					case 'scaleZ':
					case 'rotation':
					case 'rotationX':
					case 'rotationY':
					case 'rotationZ':
					case 'skewX':
					case 'skewY':
					case 'width':
					case 'height':
						keys[time][prefix + 'transform'] = this.avatar.css3('transform');
						break;

					case 'regX':
					case 'regY':
						keys[time][prefix + 'transform-origin'] = this.avatar.css3('transformOrigin');
						break;

					case 'originalWidth':
						keys[time]['width'] = this.avatar.css2('width');
						break;

					case 'originalHeight':
						keys[time]['height'] = this.avatar.css2('height');
						break;

					case 'round':
						keys[time]['border-radius'] = this.avatar[style] + 'px';
						break;

					default:
						keys[time][style] = this.avatar.css2(style);
				}
			}
		}

		var keyframesTag = '@' + prefix + 'keyframes';
		var styles = Css.getDynamicSheet();
		var paramsObj = JsonUtils.object2Json(keys);
		paramsObj = JsonUtils.replaceChart(paramsObj);

		var css = keyframesTag + ' ' + agile.id + '_' + keyframes.label + paramsObj;
		styles.insertRule(css, styles.cssRules.length);
		styles = null;
	},
	apply: function apply(agile, duration, keyframe, paramsObj) {
		var animation = '';
		var label = typeof keyframe === 'string' ? keyframe : keyframe.label;
		animation += agile.id + '_' + label + ' ';
		animation += duration + 's ';

		if (paramsObj['ease']) animation += paramsObj['ease'] + ' ';
		if (paramsObj['delay']) animation += paramsObj['delay'] + 's ';

		if (paramsObj['loop']) {
			if (paramsObj['loop'] <= 0) paramsObj['loop'] = 'infinite';
			animation += paramsObj['loop'] + ' ';
		} else if (paramsObj['repeat']) {
			if (paramsObj['repeat'] <= 0) paramsObj['repeat'] = 'infinite';
			animation += paramsObj['repeat'] + ' ';
		}

		if (paramsObj['yoyo']) {
			if (paramsObj['yoyo'] === true) paramsObj['yoyo'] = 'alternate';
			if (paramsObj['yoyo'] === false) paramsObj['yoyo'] = 'normal';
			animation += paramsObj['yoyo'] + ' ';
		}

		animation += 'forwards';

		var preTransition = Utils.isEmpty(agile.animations) ? '' : Css.css3(agile.element, 'animation') + ', ';
		agile.animations['' + this.index] = animation;
		animation = preTransition + animation;
		agile.css3('animation', animation);

		this.addCallback(agile);

		var callback = this.callbacks[agile.id];
		callback.sets['' + this.index] = keyframe.merge();
		callback.removes['' + this.index] = paramsObj['remove'] || this.remove;

		// add complete handler
		if (paramsObj['onComplete']) {
			if (paramsObj['onCompleteParams']) callback.completes['' + this.index] = [paramsObj['onComplete'], paramsObj['onCompleteParams']];else callback.completes['' + this.index] = [paramsObj['onComplete']];
		}
	},
	removeKeyframes: function removeKeyframes(frame) {
		var keyName = typeof frame === 'string' ? frame : frame.label;
		this.eachStyles(function (rule, i, styles) {
			if (rule.name === keyName) styles.deleteRule(i);
		});
	},
	indexOf: function indexOf(frame) {
		var index = -100;

		var keyName = typeof frame === 'string' ? frame : frame.label;
		this.eachStyles(function (rule, i) {
			if (rule.name === keyName) index = 100;
		});

		return index;
	},
	eachStyles: function eachStyles(callback) {
		var styles = Css.getDynamicSheet();
		var rules = styles.cssRules || styles.rules || [];

		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i];
			if (rule.type === CSSRule.KEYFRAMES_RULE || rule.type === CSSRule.MOZ_KEYFRAMES_RULE || rule.type === CSSRule.WEBKIT_KEYFRAMES_RULE || rule.type === CSSRule.O_KEYFRAMES_RULE || rule.type === CSSRule.MS_KEYFRAMES_RULE) {
				callback(rule, i, styles, rules);
			}
		}
	},
	pause: function pause(agile) {
		Css.css3(agile.element, 'animationPlayState', 'paused');
	},
	resume: function resume(agile) {
		Css.css3(agile.element, 'animationPlayState', 'running');
	},
	toggle: function toggle(agile) {
		if (Css.css3(agile.element, 'animationPlayState') === 'running') this.pause(agile);else this.resume(agile);
	},
	removeFrameByIndex: function removeFrameByIndex(agile, index) {
		index = index + '';
		var deleteItem = agile.animations[index];

		if (deleteItem) {
			agile.animations[index] = '0';
			var animation = JsonUtils.object2String(agile.animations);

			if (Utils.replace(animation, ['0,', '0', ' '], '') === '') this.removeAllFrames(agile);else agile.css3('animation', animation);
		}

		return deleteItem;
	},
	removeFrame: function removeFrame(agile, frame, removeStyle) {
		var timelineIndex = void 0;
		var keyframes = void 0;

		if (Utils.isNumber(frame)) {
			timelineIndex = frame;
			keyframes = agile.animations[timelineIndex + ''];
		} else if (typeof frame === 'string') {
			if (frame.indexOf(agile.id) > -1) keyframes = frame;else keyframes = agile.id + '_' + frame;

			timelineIndex = Utils.objectforkey(agile.animations, keyframes);
		} else {
			keyframes = agile.id + '_' + frame.label;
			timelineIndex = Utils.objectforkey(agile.animations, keyframes);
		}

		if (removeStyle) this.removeKeyframes(keyframes);
		return this.removeFrameByIndex(agile, timelineIndex);
	},
	removeFrameAfter: function removeFrameAfter(agile, frame, complete, removeStyle) {
		this.getPrefixEvent();
		agile.element.addEventListener(this.animationiteration, animationiterationHandler, false);

		function animationiterationHandler(e) {
			this.removeFrame(agile, frame, removeStyle);
			agile.element.removeEventListener(this.animationiteration, animationiterationHandler);

			complete && complete();
		}
	},
	removeAllFrames: function removeAllFrames(agile) {
		for (var index in agile.animations) {
			delete agile.animations[index];
		}Css.css3(agile.element, 'animation', '');
	},
	kill: function kill(agile) {
		this.removeAllFrames(agile);

		if (this.callbacks[agile.id]) {
			this.getPrefixEvent();
			agile.element.removeEventListener(this.animationend, this.callbacks[agile.id].fun);
			delete this.callbacks[agile.id];
		}
	},
	set: function set$$1(agile, frameObj) {
		if (!frameObj) return;

		for (var style in frameObj) {
			var newIndex = '_' + style + '_';
			var i = Agile.keyword.search(new RegExp(newIndex, 'i'));

			if (i > -1) {
				agile[style] = frameObj[style];
				continue;
			}

			if (style.indexOf('-') > -1) {
				var arr = style.split('-');
				for (var _i2 = 0; _i2 < arr.length; _i2++) {
					if (_i2 !== 0) arr[_i2] = arr[_i2].charAt(0).toUpperCase() + arr[_i2].substr(1);
				}

				agile.css2(arr.join(''), frameObj[style]);
			} else {
				agile.css2(style, frameObj[style]);
			}
		}
	},
	addCallback: function addCallback(agile) {
		var _this = this;

		if (this.callbacks[agile.id]) return this.callbacks[agile.id];

		this.callbacks[agile.id] = {
			fun: function fun(e) {
				var callback = _this.callbacks[agile.id];

				for (var index in agile.animations) {
					if (agile.animations[index].indexOf(e.animationName) !== 0) continue;

					_this.removeFrame(agile, index, callback.removes[index]);
					delete callback.removes[index];

					_this.set(agile, callback.sets[index]);
					delete callback.sets[index];

					if (callback.completes[index]) {
						if (callback.completes[index].length === 1) callback.completes[index][0].apply(agile);else callback.completes[index][0].apply(agile, callback.completes[index][1]);

						try {
							delete callback.completes[index];
						} catch (e) {}
					}
				}
			},
			completes: {},
			removes: {},
			sets: {}
		};

		this.getPrefixEvent();
		agile.element.addEventListener(this.animationend, this.callbacks[agile.id].fun, false);

		return this.callbacks[agile.id];
	},
	getPrefixEvent: function getPrefixEvent() {
		if (this.animationend) return this.animationend;

		var prefix = Css.getPrefix();
		switch (prefix) {
			case 'Webkit':
				this.animationend = 'webkitAnimationEnd';
				this.animationiteration = 'webkitAnimationIteration';
				break;

			case 'ms':
				this.animationend = 'MSAnimationEnd';
				this.animationiteration = 'MSAnimationIteration';
				break;

			case 'O':
				this.animationend = 'oanimationend';
				this.animationiteration = 'oanimationiteration';
				break;

			case 'Moz':
				this.animationend = 'animationend';
				this.animationiteration = 'animationiteration';
				break;

			default:
				this.animationend = 'animationend';
				this.animationiteration = 'animationiteration';
		}

		return this.animationend;
	}
};

var MovieClip = function (_Image) {
	inherits(MovieClip, _Image);

	function MovieClip(image, width, height, labels, speed) {
		classCallCheck(this, MovieClip);

		var _this = possibleConstructorReturn(this, (MovieClip.__proto__ || Object.getPrototypeOf(MovieClip)).call(this, image, width, height));

		_this.widthSize = true;
		_this.heightSize = true;

		_this._avatar.originalHeight = height;
		_this._avatar.originalWidth = width;

		_this._avatar.currentFrame = 1;
		if (labels) _this.setLabel(labels);

		_this.labels = {};
		_this.speed = speed || .6;
		_this.loop = true;

		_this.stop();
		return _this;
	}

	createClass(MovieClip, [{
		key: 'stop',
		value: function stop() {
			this.playing = false;
			this.pause();
		}
	}, {
		key: 'play',
		value: function play(label) {
			if (this.recordLabel) {
				this.animations[this.recordLabel.index] = this.recordLabel.frame;
				var animation = JsonUtils.object2String(this.animations);
				this.css3('animation', animation);
			}

			this.playing = true;
			this.resume();
		}
	}, {
		key: 'gotoAndPlay',
		value: function gotoAndPlay(frameNumber) {
			if (typeof frameNumber === 'string') {
				this.label = frameNumber;
			} else {
				frameNumber--;

				var props = this.labels[this.label];
				var to = props['to'];
				var totalframes = props['totalframes'];
				var w = props['width'];
				var h = props['height'];

				var length = void 0;
				var position = void 0;

				if (h === 0) {
					length = w * frameNumber / totalframes;
					position = -length + 'px ' + -to.y + 'px';
				} else {
					length = h * frameNumber / totalframes;
					position = -to.x + 'px ' + -length + 'px';
				}

				this.css2('backgroundPosition', position);
				var animation = JsonUtils.object2String(this.animations);
				this.css3('animation', animation);

				this.play();
			}
		}
	}, {
		key: 'gotoAndStop',
		value: function gotoAndStop(frameNumber) {
			if (typeof frameNumber === 'string') {
				this.label = frameNumber;
			} else {
				frameNumber--;

				var props = this.labels[this.label];
				var to = props['to'];
				var totalframes = props['totalframes'];
				var w = props['width'];
				var h = props['height'];

				var length = void 0;
				var position = void 0;

				if (h === 0) {
					length = w * frameNumber / totalframes;
					position = -length + 'px ' + -to.y + 'px';
				} else {
					length = h * frameNumber / totalframes;
					position = -to.x + 'px ' + -length + 'px';
				}

				this.css2('backgroundPosition', position);
				var frame = Timeline.removeFrameByIndex(this, this.currentTimelineIndex);

				this.recordLabel = {
					frame: frame,
					index: this.currentTimelineIndex
				};
			}
		}
	}, {
		key: 'setLabel',
		value: function setLabel(label, from, to, totalframes) {
			if ((typeof label === 'undefined' ? 'undefined' : _typeof(label)) === 'object') {
				var frome = void 0;
				var _to = void 0;
				var frame = void 0;
				var l = void 0;

				if (label['from'] && label['to']) {
					frome = label['from'];
					_to = label['to'];
					l = label['label'];
					frame = label['totalframes'];

					return this.setLabel(l, frome, _to, frame);
				} else {
					for (var _l in label) {
						frome = label[_l]['from'];
						_to = label[_l]['to'];
						frame = label[_l]['totalframes'];

						return this.setLabel(_l, frome, _to, frame);
					}
				}
			} else {
				this.labels[label] = this.makeFrame(from, to, totalframes);
				this.label = label;
			}

			return this.labels[label];
		}
	}, {
		key: 'makeFrame',
		value: function makeFrame(from, to, totalframes) {
			from = from || { x: '0px', y: '0px' };
			to = to || { x: '-200%', y: '0px' };

			var width = Math.abs(parseFloat(to.x - from.x));
			var height = Math.abs(parseFloat(to.y - from.y));
			var frame = new Keyframes();

			var fromX = -from.x;
			var fromY = -from.y;
			var toX = -to.x;
			var toY = -to.y;

			frame.add(0, { 'background-position': fromX + 'px ' + fromY + 'px' });
			frame.add(100, { 'background-position': toX + 'px ' + toY + 'px' });

			return {
				frame: frame, totalframes: totalframes, width: width, height: height, from: from, to: to
			};
		}
	}, {
		key: 'toString',
		value: function toString() {
			return 'MovieClip';
		}
	}, {
		key: 'currentFrame',
		get: function get$$1() {
			// sorry this have a lot of bugs i am fixing
			var props = this.labels[this.label];
			var totalframes = props['totalframes'];
			var w = props['width'];
			var h = props['height'];
			var length = void 0;

			if (h === 0) {
				length = Utils.getCssValue(this, 'backgroundPosition', 0, 2);
				this._avatar.currentFrame = length * totalframes / w;
			} else {
				length = Utils.getCssValue(this, 'backgroundPosition', 1, 2);
				this._avatar.currentFrame = length * totalframes / h;
			}

			return this._avatar.currentFrame;
		}
	}, {
		key: 'label',
		get: function get$$1() {
			return this._avatar.label;
		},
		set: function set$$1(label) {
			if (this.labels[label]) {
				this._avatar.label = label;
				var frame = this.labels[label]['frame'];
				var totalframes = this.labels[label]['totalframes'];

				if (Timeline.indexOf(frame) <= -1) Timeline.insertKeyframes(this, frame);

				var loop = this.loop ? -1 : 0;

				Timeline.removeFrameByIndex(this, this.currentTimelineIndex);
				this.currentTimelineIndex = Timeline.playFrame(this, this.speed, frame, {
					loop: loop,
					ease: 'steps(' + totalframes + ')'
				});

				this.totalframes = totalframes;
				this.play();
			}
		}
	}, {
		key: 'speed',
		get: function get$$1() {
			return this._avatar.speed;
		},
		set: function set$$1(speed) {
			this._avatar.speed = speed;

			if (this.labels[this.label]) {
				Timeline.removeFrameByIndex(this, this.currentTimelineIndex);

				var loop = this.loop ? -1 : 0;
				var frame = this.labels[this.label]['frame'];
				var totalframes = this.labels[this.label]['totalframes'];
				Timeline.removeFrameByIndex(this, this.currentTimelineIndex);

				this.currentTimelineIndex = Timeline.playFrame(this, this.speed, frame, {
					loop: loop,
					ease: 'steps(' + totalframes + ')'
				});
			}

			this.play();
		}
	}]);
	return MovieClip;
}(AgileImage);

var Rect = function (_DisplayObject) {
	inherits(Rect, _DisplayObject);

	function Rect() {
		var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
		var height = arguments[1];
		var color = arguments[2];
		classCallCheck(this, Rect);

		var _this = possibleConstructorReturn(this, (Rect.__proto__ || Object.getPrototypeOf(Rect)).call(this));

		_this.x = _this.y = 0;
		_this.width = width;
		_this.height = height || _this.width;

		color = color || 'blue';
		_this.background(color);
		return _this;
	}

	createClass(Rect, [{
		key: 'toString',
		value: function toString() {
			return 'Rect';
		}
	}, {
		key: 'round',
		get: function get$$1() {
			return this._avatar.round;
		},
		set: function set$$1(round) {
			this._avatar.round = round;
			this.css3('borderRadius', this.round + 'px');
		}
	}]);
	return Rect;
}(DisplayObject);

var intervalId = void 0;

var SpriteSheet = function (_DisplayObject) {
    inherits(SpriteSheet, _DisplayObject);

    function SpriteSheet(imgArr, width, height, speed) {
        var useIntervl = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
        var useCssSprite = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
        classCallCheck(this, SpriteSheet);

        var _this = possibleConstructorReturn(this, (SpriteSheet.__proto__ || Object.getPrototypeOf(SpriteSheet)).call(this));

        intervalId = -1;
        _this.imgArr = imgArr;
        if (typeof speed === 'boolean') {
            _this.speed = 30;
            _this.useCssSprite = _this.speed;
        } else {
            _this.speed = speed || 30;
            _this.useCssSprite = useCssSprite;
        }

        _this.useIntervl = useIntervl;
        _this.state = 'stop';

        _this.originalHeight = height;
        _this.originalWidth = width;
        _this.currentFrame = 1;
        _this.prevFrame = _this.currentFrame;
        _this.totalFrames = imgArr.length;

        _this.setBackgroundImage();

        _this.loop = true;
        _this.prvePlay = false;
        _this.elapsed = 0;
        _this.stop();
        return _this;
    }

    createClass(SpriteSheet, [{
        key: 'setBackgroundImage',
        value: function setBackgroundImage() {
            if (this.useCssSprite) {
                this.removeClass(this.imgArr[this.prevFrame - 1]);
                this.addClass(this.imgArr[this.currentFrame - 1]);
            } else {
                this.backgroundImage = this.imgArr[this.currentFrame - 1];
            }
        }
    }, {
        key: 'play',
        value: function play() {
            var _this2 = this;

            if (this.useIntervl) {
                if (intervalId < 0) intervalId = setInterval(function () {
                    return _this2.update();
                }, 1000 / this.speed);
            }

            this.state = 'play';
        }
    }, {
        key: 'stop',
        value: function stop(clear) {
            if (this.useIntervl && clear) {
                clearInterval(intervalId);
                intervalId = -1;
            }

            this.state = 'stop';
        }
    }, {
        key: 'gotoAndPlay',
        value: function gotoAndPlay(frame) {
            this.currentFrame = frame;
            this.setBackgroundImage();
            this.play();
            this.state = 'play';
        }
    }, {
        key: 'gotoAndStop',
        value: function gotoAndStop(frame) {
            this.currentFrame = frame;
            this.setBackgroundImage();
            this.stop();
            this.state = 'stop';
        }
    }, {
        key: 'update',
        value: function update() {
            if (this.state === 'stop') return;

            if (!this.useIntervl) {
                if (!this.oldTime) this.oldTime = new Date().getTime();

                var time = new Date().getTime();
                this.elapsed += time - this.oldTime;
                this.oldTime = time;

                if (this.elapsed >= 1000 / this.speed) {
                    this.elapsed = this.elapsed % (1000 / this.speed);
                } else {
                    return;
                }
            }

            this.render();
        }
    }, {
        key: 'render',
        value: function render() {
            // The use of two times for a reason
            if (this.state === 'stop') return;

            this.prevFrame = this.currentFrame;

            if (this.prvePlay) this.currentFrame--;else this.currentFrame++;

            if (this.prvePlay) {
                if (this.loop) {
                    if (this.currentFrame < 1) this.currentFrame = this.totalFrames;
                } else {
                    if (this.currentFrame <= 1) {
                        this.currentFrame = 1;
                        this.stop();
                    }
                }
            } else {
                if (this.loop) {
                    if (this.currentFrame > this.totalFrames) this.currentFrame = 1;
                } else {
                    if (this.currentFrame >= this.totalFrames) {
                        this.currentFrame = this.totalFrames;
                        this.stop();
                    }
                }
            }

            this.setBackgroundImage();
        }
    }, {
        key: 'toString',
        value: function toString() {
            return 'SpriteSheet';
        }
    }]);
    return SpriteSheet;
}(DisplayObject);

var Triangle = function (_DisplayObject) {
	inherits(Triangle, _DisplayObject);

	function Triangle() {
		var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
		var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 173.2;
		var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#00cc22';
		classCallCheck(this, Triangle);

		var _this = possibleConstructorReturn(this, (Triangle.__proto__ || Object.getPrototypeOf(Triangle)).call(this));

		_this.css({
			'width': '0px',
			'height': '0px'
		});

		_this.css({
			'borderStyle': 'solid',
			'borderTopColor': 'transparent',
			'borderRightColor': 'transparent',
			'borderLeftColor': 'transparent'
		}, 3);

		_this._avatar.ox = 0;
		_this.width = width;
		_this.height = height;
		_this.color = color;
		_this.x = _this.y = 0;
		return _this;
	}

	createClass(Triangle, [{
		key: 'transform',
		value: function transform() {
			var parentOffsetX = void 0,
			    parentOffsetY = void 0,
			    thisOffsetX = void 0,
			    thisOffsetY = void 0,
			    translate = void 0,
			    rotate = void 0,
			    scale = void 0,
			    skew = void 0;

			if (Agile$1.mode === '3d' && Agile$1.support3d) {
				parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth : 0;
				parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight : 0;
				thisOffsetX = this.regX * this.originalWidth;
				thisOffsetY = this.regY * this.originalHeight;
				translate = 'translate3d(' + (this._avatar.x - thisOffsetX + parentOffsetX) + 'px,' + (this.y - thisOffsetY + parentOffsetY) + 'px,' + this.z + 'px) ';
				rotate = 'rotateX(' + this.rotationX + 'deg) ' + 'rotateY(' + this.rotationY + 'deg) ' + 'rotateZ(' + this.rotationZ + 'deg) ';
				scale = 'scale3d(' + this.scaleX + ',' + this.scaleY + ',' + this.scaleZ + ') ';
				skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';

				this.css3('transform', translate + rotate + scale + skew);
			} else {
				parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth : 0;
				parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight : 0;
				thisOffsetX = this.regX * this.originalWidth;
				thisOffsetY = this.regY * this.originalHeight;
				translate = 'translate(' + (this._avatar.x - thisOffsetX + parentOffsetX) + 'px,' + (this.y - thisOffsetY + parentOffsetY) + 'px) ';
				rotate = 'rotate(' + this.rotationZ + 'deg) ';
				scale = 'scale(' + this.scaleX + ',' + this.scaleY + ') ';
				skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';

				this.css3('transform', translate + rotate + scale + skew);
			}
		}
	}, {
		key: 'getCirumRadius',
		value: function getCirumRadius() {
			var tha = 2 * Math.atan2(this.height, this.width);
			return this.width / Math.sin(tha);
		}
	}, {
		key: 'regCircumcenter',
		value: function regCircumcenter() {
			this.regY = this.getCirumRadius() / this.height;
		}
	}, {
		key: 'toString',
		value: function toString() {
			return 'Triangle';
		}
	}, {
		key: 'color',
		get: function get$$1() {
			return this._avatar.color;
		},
		set: function set$$1(color) {
			if (color === 'random' || color === '#random') color = Color.randomColor();

			this._avatar.color = color;
			this.css3('borderBottomColor', this.color);
		}
	}, {
		key: 'originalWidth',
		get: function get$$1() {
			return this._avatar.originalWidth;
		},
		set: function set$$1(originalWidth) {
			this._avatar.originalWidth = originalWidth;
		}
	}, {
		key: 'originalHeight',
		get: function get$$1() {
			return this._avatar.originalHeight;
		},
		set: function set$$1(originalHeight) {
			this._avatar.originalHeight = originalHeight;
		}
	}, {
		key: 'width',
		get: function get$$1() {
			return this._avatar.width;
		},
		set: function set$$1(width) {
			this._avatar.width = width;

			if (!this.originalWidth) {
				this.originalWidth = width;
				this.css({
					'borderWidth': '0px',
					'borderRightWidth': width + 'px',
					'borderLeftWidth': width + 'px'
				}, 3);
				this._avatar.ox = width / 2;
			} else {
				this.scaleX = this.width / this.originalWidth;
			}
		}
	}, {
		key: 'height',
		get: function get$$1() {
			return this._avatar.height;
		},
		set: function set$$1(height) {
			this._avatar.height = height;

			if (!this.originalHeight) {
				this.originalHeight = height;
				this.css({
					'borderTopWidth': '0px',
					'borderBottomWidth': height + 'px'
				}, 3);
			} else {
				this.scaleY = this.height / this.originalHeight;
			}
		}
	}, {
		key: 'x',
		get: function get$$1() {
			return this._avatar.x + this._avatar.ox;
		},
		set: function set$$1(x) {
			this._avatar.x = x - this._avatar.ox;
			this.transform();
		}
	}]);
	return Triangle;
}(DisplayObject);

var ease = {
	'linear': 'linear',
	'easeBasic': 'ease',
	'easeInBasic': 'ease-in',
	'easeOutBasic': 'ease-out',
	'easeInOutBasic': 'ease-in-out',
	'easeOutCubic': 'cubic-bezier(.215,.61,.355,1)',
	'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
	'easeInCirc': 'cubic-bezier(.6,.04,.98,.335)',
	'easeOutCirc': 'cubic-bezier(.075,.82,.165,1)',
	'easeInOutCirc': 'cubic-bezier(.785,.135,.15,.86)',
	'easeInExpo': 'cubic-bezier(.95,.05,.795,.035)',
	'easeOutExpo': 'cubic-bezier(.19,1,.22,1)',
	'easeInOutExpo': 'cubic-bezier(1,0,0,1)',
	'easeInQuad': 'cubic-bezier(.55,.085,.68,.53)',
	'easeOutQuad': 'cubic-bezier(.25,.46,.45,.94)',
	'easeInOutQuad': 'cubic-bezier(.455,.03,.515,.955)',
	'easeInQuart': 'cubic-bezier(.895,.03,.685,.22)',
	'easeOutQuart': 'cubic-bezier(.165,.84,.44,1)',
	'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
	'easeInQuint': 'cubic-bezier(.755,.05,.855,.06)',
	'easeOutQuint': 'cubic-bezier(.23,1,.32,1)',
	'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
	'easeInSine': 'cubic-bezier(.47,0,.745,.715)',
	'easeOutSine': 'cubic-bezier(.39,.575,.565,1)',
	'easeInOutSine': 'cubic-bezier(.445,.05,.55,.95)',
	'easeInBack': 'cubic-bezier(.6,-.28,.735,.045)',
	'easeOutBack': 'cubic-bezier(.175, .885,.32,1.275)',
	'easeInOutBack': 'cubic-bezier(.68,-.55,.265,1.55)',
	'stepStart': 'step-start',
	'stepStop': 'step-stop'
};

var ScrollingBg = function (_Image) {
	inherits(ScrollingBg, _Image);

	function ScrollingBg(image, width, height) {
		var speed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
		var direction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'left';
		var backgroundWidth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
		var backgroundHeight = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
		classCallCheck(this, ScrollingBg);

		var _this = possibleConstructorReturn(this, (ScrollingBg.__proto__ || Object.getPrototypeOf(ScrollingBg)).call(this, image, width, height));

		_this.widthSize = true;
		_this.heightSize = true;

		_this.speed = speed;
		_this.direction = direction;

		// fix background-position-y bug
		_this.backgroundWidth = backgroundWidth;
		_this.backgroundHeight = backgroundHeight;
		_this.originalHeight = height;
		_this.originalWidth = width;

		_this.scrolling();
		return _this;
	}

	createClass(ScrollingBg, [{
		key: 'scrolling',
		value: function scrolling(speed, ease$$1) {
			speed = speed || this.speed;
			ease$$1 = ease$$1 || ease.linear;

			if (this.scrollframes) {
				this.removeFrame(this.scrollframes);
				this.scrollframes.destroy();
			}

			this.scrollframes = new Keyframes();
			this.scrollframes.add(0, {
				'background-position': '0% 0%'
			});

			if (this.direction === 'left') {
				var h = this.backgroundWidth ? 1 * this.backgroundWidth + 'px' : '200%';
				this.scrollframes.add(100, {
					'background-position': h + ' 0%'
				});
			} else if (this.direction === 'right') {
				var _h = this.backgroundWidth ? -1 * this.backgroundWidth + 'px' : '-200%';
				this.scrollframes.add(100, {
					'background-position': _h + ' 0%'
				});
			} else if (this.direction === 'up') {
				var _h2 = this.backgroundHeight ? -1 * this.backgroundHeight + 'px' : '0%';
				this.scrollframes.add(100, {
					'background-position': '0% ' + _h2
				});
			} else if (this.direction === 'down' || this.direction === 'bottom') {
				var _h3 = this.backgroundHeight ? 1 * this.backgroundHeight + 'px' : '0%';
				this.scrollframes.add(100, {
					'background-position': '0% ' + _h3
				});
			}

			this.addFrame(speed, this.scrollframes, {
				loop: -1,
				ease: ease$$1
			});
		}
	}, {
		key: 'toString',
		value: function toString() {
			return 'ScrollingBg';
		}
	}, {
		key: 'backgroundWidth',
		get: function get$$1() {
			return this._avatar.backgroundWidth;
		},
		set: function set$$1(backgroundWidth) {
			this._avatar.backgroundWidth = backgroundWidth;
			this.scrolling();
		}
	}, {
		key: 'backgroundHeight',
		get: function get$$1() {
			return this._avatar.backgroundHeight;
		},
		set: function set$$1(backgroundHeight) {
			this._avatar.backgroundHeight = backgroundHeight;
			this.scrolling();
		}
	}, {
		key: 'speed',
		get: function get$$1() {
			return this._avatar.speed;
		},
		set: function set$$1(speed) {
			this._avatar.speed = speed;
			this.scrolling();
		}
	}, {
		key: 'direction',
		get: function get$$1() {
			return this._avatar.direction;
		},
		set: function set$$1(direction) {
			this._avatar.direction = direction;
			this.scrolling();
		}
	}]);
	return ScrollingBg;
}(AgileImage);

var Semicircle = function (_DisplayObject) {
	inherits(Semicircle, _DisplayObject);

	function Semicircle() {
		var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 25;
		var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'purple';
		classCallCheck(this, Semicircle);

		var _this = possibleConstructorReturn(this, (Semicircle.__proto__ || Object.getPrototypeOf(Semicircle)).call(this));

		_this.radius = radius;
		_this.background(color);
		_this.x = _this.y = 0;
		return _this;
	}

	createClass(Semicircle, [{
		key: 'toString',
		value: function toString() {
			return 'Semicircle';
		}
	}, {
		key: 'radius',
		get: function get$$1() {
			return this._avatar.radius;
		},
		set: function set$$1(radius) {
			this._avatar.radius = radius;
			this.width = this.radius * 2;
			this.height = this.radius;

			this.css3('borderRadius', this.radius + 'px ' + this.radius + 'px 0 0');
		}
	}]);
	return Semicircle;
}(DisplayObject);

var Filter = function () {
	function Filter(type) {
		classCallCheck(this, Filter);

		this.type = type;
		this.elements = [];
		this.styleObj = {};
		this.arguments = arguments;
		this.a = this.b = this.c = this.d = this.e = this.f = this.g = null;
	}

	createClass(Filter, [{
		key: 'apply',
		value: function apply(agileEle) {
			this.elements.push(agileEle);
			this.styleObj[agileEle.id] = { style: '', value: '' };

			switch (this.type) {
				case 'stroke':
					this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
					this.b = this.arguments.length > 2 ? this.arguments[2] : '#000';
					break;

				case 'blur':
					this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
					this.b = this.arguments.length > 2 ? this.arguments[2] : '#000';
					break;

				case 'shadow':
					this.a = this.arguments.length > 1 ? this.arguments[1] : 3;
					this.b = this.arguments.length > 2 ? this.arguments[2] : 3;
					this.c = this.arguments.length > 3 ? this.arguments[3] : 5;
					this.d = this.arguments.length > 4 ? this.arguments[4] : '#000';
					break;

				case 'glow':
					this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
					this.b = this.arguments.length > 2 ? this.arguments[2] : '#000';
					break;

				case 'insetglow':
				case 'insetGlow':
				case 'inset-glow':
					this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
					this.b = this.arguments.length > 2 ? this.arguments[2] : '#000';
					break;

				case '3d':
					this.a = this.arguments.length > 1 ? this.arguments[1] : 6;
					this.b = this.arguments.length > 2 ? this.arguments[2] : '#000';
					break;
			}

			this.reset(agileEle);
		}
	}, {
		key: 'reset',
		value: function reset(elements) {
			var thisAgiles = elements === undefined ? this.elements : [elements];

			for (var i = 0, length = thisAgiles.length; i < length; i++) {
				var agileEle = thisAgiles[i];
				this.styleObj[agileEle.id].value = '';

				switch (this.type) {
					case 'stroke':
						if (agileEle instanceof Text) {
							var s1 = -this.a + 'px ' + -this.a + 'px 0 ' + this.b;
							var s2 = this.a + 'px ' + -this.a + 'px 0 ' + this.b;
							var s3 = -this.a + 'px ' + this.a + 'px 0 ' + this.b;
							var s4 = this.a + 'px ' + this.a + 'px 0 ' + this.b;

							this.styleObj[agileEle.id].value = s1 + ',' + s2 + ',' + s3 + ',' + s4;
						} else {
							this.styleObj[agileEle.id].value = '0 0 0 ' + this.a + 'px ' + this.b;
						}
						break;

					case 'blur':
						Css.css2(agileEle.element, 'color', Color$1.alpha0);
						Css.css3(agileEle.element, 'background', Color$1.alpha0);
						this.styleObj[agileEle.id].value = '0 0 ' + this.a + 'px ' + this.b;
						break;

					case 'shadow':
						this.styleObj[agileEle.id].value = this.a + 'px ' + this.b + 'px ' + this.c + 'px ' + this.d;
						break;

					case 'glow':
						this.styleObj[agileEle.id].value = '0 0 ' + this.a + 'px ' + this.b;
						break;

					case 'insetglow':
					case 'insetGlow':
					case 'inset-glow':
						this.styleObj[agileEle.id].value = 'inset 0 0 ' + this.a + 'px ' + this.b;
						break;

					case '3d':
						for (var _i = 1, _length = this.a; _i <= _length; _i++) {
							if (_i === _length) this.styleObj[agileEle.id].value += _i + 'px ' + _i + 'px ' + this.b;else this.styleObj[agileEle.id].value += _i + 'px ' + _i + 'px ' + this.b + ',';
						}

						break;
				}

				if (agileEle instanceof Text) this.styleObj[agileEle.id].style = 'textShadow';else this.styleObj[agileEle.id].style = 'boxShadow';

				Css.css3(agileEle.element, this.styleObj[agileEle.id].style, this.styleObj[agileEle.id].value);
			}
		}
	}, {
		key: 'erase',
		value: function erase(agileEle) {
			Utils.arrayRemove(this.elements, agileEle);
			Css.css3(agileEle.element, this.styleObj[agileEle.id].style, null);
			delete this.styleObj[agileEle.id];
		}
	}]);
	return Filter;
}();

var array = [];

var EventDispatcher = function () {
	function EventDispatcher() {
		classCallCheck(this, EventDispatcher);

		this._listeners = null;
	}

	createClass(EventDispatcher, [{
		key: "addEventListener",
		value: function addEventListener(type, listener) {
			if (!this._listeners) this._listeners = {};
			if (this._listeners[type] === undefined) this._listeners[type] = [];
			if (this._listeners[type].indexOf(listener) === -1) this._listeners[type].push(listener);
		}
	}, {
		key: "removeEventListener",
		value: function removeEventListener(type, listener) {
			if (!this._listeners) return;

			var listeners = this._listeners;
			var listenerArray = listeners[type];

			if (listenerArray !== undefined) {
				var index = listenerArray.indexOf(listener);
				if (index !== -1) listenerArray.splice(index, 1);
			}
		}
	}, {
		key: "dispatchEvent",
		value: function dispatchEvent(event) {
			if (!this._listeners) return;

			array.length = 0;
			var listeners = this._listeners;
			var listenerArray = listeners[event.type];

			if (listenerArray !== undefined) {
				event.target = this;

				for (var i = 0; i < listenerArray.length; i++) {
					array[i] = listenerArray[i];
				}for (var _i = 0; _i < listenerArray.length; _i++) {
					array[_i].call(this, event);
				}
			}
		}
	}]);
	return EventDispatcher;
}();

var imageBuffer = {};

var LoadManager = function (_EventDispatcher) {
	inherits(LoadManager, _EventDispatcher);

	function LoadManager() {
		classCallCheck(this, LoadManager);

		var _this = possibleConstructorReturn(this, (LoadManager.__proto__ || Object.getPrototypeOf(LoadManager)).call(this));

		_this._urls = [];
		_this._loaderList = [];
		_this._targetList = {};
		_this._fileSize = [];
		_this._totalSize = 0;

		_this.index = 0;
		_this.loadIndex = 0;
		_this.loaded = false;
		_this.baseURL = '';
		_this.parallel = 4;

		_this.completeHandler = _this.completeHandler.bind(_this);
		_this.ioErrorHandler = _this.ioErrorHandler.bind(_this);
		return _this;
	}

	createClass(LoadManager, [{
		key: 'ioErrorHandler',
		value: function ioErrorHandler(e) {
			this.loadIndex++;
			this._targetList.push(null);

			this.dispatchEvent({ type: Agile.LOAD_ERROR });
			this.checkLoaded();
			this.singleLoad();
		}
	}, {
		key: 'completeHandler',
		value: function completeHandler(e) {
			var num = Css.attr(e.target, 'data-index');
			var targetList = this._targetList;
			var loaderList = this._loaderList;
			var img = loaderList[num];

			for (var index in targetList) {
				if (Css.attr(img, 'data-url') === targetList[index]) targetList[index] = img;
			}

			this.loadIndex++;
			this.dispatchEvent({ type: Agile.SINGLE_LOADED });
			this.checkLoaded();
			this.singleLoad();
		}
	}, {
		key: 'checkLoaded',
		value: function checkLoaded() {
			if (this.loadIndex >= this._urls.length && !this.loaded) {
				this.loaded = true;
				this.dispatchEvent({ type: Agile.GROUP_LOADED });
			}
		}
	}, {
		key: 'load',
		value: function load() {
			var index = 0;

			for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
				rest[_key] = arguments[_key];
			}

			for (var i = 0; i < rest.length; i++) {
				var url = rest[i];

				if (typeof url === 'string') {
					this._targetList['' + index] = url;
					this._urls.push(url);

					index++;
				} else if (Utils.isArray(url)) {
					for (var j = 0; j < url.length; j++) {
						this._targetList['' + index] = url[j];
						this._urls.push(url[j]);

						index++;
					}
				} else {
					for (var _index in url) {
						this._targetList[_index] = url[_index];
						this._urls.push(url[_index]);
					}
				}
			}

			var length = Math.min(this.parallel, this._urls.length);
			for (var _i = 0; _i < length; _i++) {
				this.singleLoad();
			}
		}
	}, {
		key: 'singleLoad',
		value: function singleLoad() {
			if (this.loaded) return;
			if (this.index >= this._urls.length) return;

			var url = String(this._urls[this.index]);
			var image = new Image();

			image.onerror = this.ioErrorHandler;
			image.onload = this.completeHandler;
			image.src = this.baseURL + url;
			Css.attr(image, 'data-url', url);
			Css.attr(image, 'data-index', this.index);

			this.index++;
			this._loaderList.push(image);
		}
	}, {
		key: 'loadScale',
		get: function get$$1() {
			return this.loadIndex / this._urls.length;
		}
	}, {
		key: 'targetList',
		get: function get$$1() {
			return this._targetList;
		}
	}, {
		key: 'loaderList',
		get: function get$$1() {
			return this._loaderList;
		}
	}, {
		key: 'fileSize',
		set: function set$$1(size) {
			this._fileSize = size;
			this._totalSize = 0;

			for (var i = 0; i < this._fileSize.length; i++) {
				this._totalSize += this._fileSize[i];
			}
		}
	}], [{
		key: 'getImage',
		value: function getImage(img, callback) {
			if (typeof img === 'string') {
				if (imageBuffer[img]) {
					callback(imageBuffer[img]);
				} else {
					var myImage = new Image();
					myImage.onload = function (e) {
						imageBuffer[img] = myImage;
						callback(imageBuffer[img]);
					};
					myImage.src = img;
				}

				return img;
			} else if ((typeof img === 'undefined' ? 'undefined' : _typeof(img)) === 'object') {
				imageBuffer[img.src] = img;
				callback(imageBuffer[img.src]);

				return img.src;
			}
		}
	}]);
	return LoadManager;
}(EventDispatcher);

var MovieClipLabel = function () {
	function MovieClipLabel(label, x1, y1, x2, y2) {
		var frames = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
		classCallCheck(this, MovieClipLabel);

		if ((typeof x1 === 'undefined' ? 'undefined' : _typeof(x1)) === 'object') {
			this.from = x1.from;
			this.to = x1.to;
			this.label = label;
			this.totalframes = x1.totalframes || 1;
		} else {
			this.label = label;
			this.from = {
				x: x1,
				y: y1
			};

			this.to = {
				x: x2,
				y: y2
			};

			this.totalframes = frames;
		}
	}

	createClass(MovieClipLabel, [{
		key: 'toString',
		value: function toString() {
			return 'MovieClipLabel';
		}
	}]);
	return MovieClipLabel;
}();

var Tween = {
	keyword: ['ease', 'delay', 'yoyo', 'all', 'loop', 'repeat', 'frame', 'onStart', 'onUpdate', 'onComplete', 'onCompleteParams', 'overwrite', 'setTimeout'],
	callbacks: {},
	arguments: {},
	oldAttribute: {},
	setTimeout: true,
	timeoutDelay: 30,
	index: 0,

	to: function to(agile, duration, paramsObj) {
		var _this = this;

		var propertys = paramsObj['all'] ? ['all'] : this.apply(agile, paramsObj, this.index);
		var transition = '';

		for (var i = 0; i < propertys.length; i++) {
			if (i > 0) transition += ', ';

			transition += propertys[i];
			transition += ' ' + duration + 's';

			if (paramsObj['ease']) transition += ' ' + paramsObj['ease'];
			if (paramsObj['delay']) transition += ' ' + paramsObj['delay'] + 's';
		}

		var id = -999;
		if (this.useSetTimeout()) {
			id = setTimeout(function (agile, transition, paramsObj, tweenIndex) {
				_this.start(agile, transition, paramsObj, tweenIndex);
				id = -999;
			}, this.timeoutDelay, agile, transition, paramsObj, this.index);
		} else {
			this.start(agile, transition, paramsObj, this.index);
		}

		this.arguments[this.index + ''] = [agile, duration, paramsObj, id];
		return this.index++;
	},
	useSetTimeout: function useSetTimeout() {
		var use = false;
		if (this.setTimeout !== undefined) {
			use = this.setTimeout;
		} else {
			if (Utils.browser().isFirefox || Utils.browser().isIE) {
				use = true;
			} else {
				use = false;
			}
		}

		return use;
	},
	start: function start(agile, transition, paramsObj, tweenIndex) {
		if (paramsObj['overwrite']) {
			this.killTweensOf(agile);
			Utils.destroyObject(agile.transitions);
			agile.transitions['' + tweenIndex] = transition;
		} else {
			var preTransition = Utils.isEmpty(agile.transitions) || JsonUtils.object2String(agile.transitions) === 'none' ? '' : Css.css3(agile.element, 'transition') + ', ';
			agile.transitions['' + tweenIndex] = transition;
			transition = preTransition + transition;
		}

		Css.css3(agile.element, 'transition', transition);
		this.set(agile, paramsObj);

		this.addCallback(agile);

		if (paramsObj['onStart']) {
			var delay = paramsObj['delay'] || 0;
			setTimeout(paramsObj['onStart'], delay * 1000);
		}

		if (paramsObj['onComplete']) {
			if (paramsObj['onCompleteParams']) this.callbacks[agile.id].completes['' + tweenIndex] = [paramsObj['onComplete'], paramsObj['onCompleteParams']];else this.callbacks[agile.id].completes['' + tweenIndex] = [paramsObj['onComplete']];
		}
	},
	from: function from(agile, duration, paramsObj) {
		var toObj = {};

		for (var index in paramsObj) {
			var newIndex = '_' + index + '_';
			var i = this.getKeywordString().search(new RegExp(newIndex, 'i'));

			if (i === -1) {
				toObj[index] = agile[index];
				agile[index] = paramsObj[index];
			} else {
				toObj[index] = paramsObj[index];
			}
		}

		return this.to(agile, duration, toObj);
	},
	fromTo: function fromTo(agile, duration, fromObj, toObj) {
		for (var index in fromObj) {
			var newIndex = '_' + index + '_';
			var i = this.getKeywordString().search(new RegExp(newIndex, 'i'));
			if (i === -1) agile[index] = fromObj[index];
		}

		return this.to(agile, duration, toObj);
	},
	apply: function apply(agile, paramsObj, tweenIndex) {
		var propertys = [];

		for (var index in paramsObj) {
			var newIndex = '_' + index + '_';
			var i = this.getKeywordString().search(new RegExp(newIndex, 'i'));

			if (i <= -1) {
				this.getOldAttribute(agile, tweenIndex)[index] = agile[index];

				if (index === 'alpha') index = 'opacity';else if (index === 'color' && !(agile instanceof Text)) index = 'background-color';else if (index === 'x' || index === 'y' || index === 'z') index = Agile.transform;else if (index === 'scaleX' || index === 'scaleY' || index === 'scaleZ') index = Agile.transform;else if (index === 'rotationX' || index === 'rotation' || index === 'rotationY' || index === 'rotationZ') index = Agile.transform;else if (index === 'skewX' || index === 'skewY') index = Agile.transform;else if (index === 'regX' || index === 'regY') index = this.Agile.transformOrigin;else if (index === 'width' || index === 'height') index = Agile.transform;else if (index === 'originalWidth') index = 'width';else if (index === 'originalHeight') index = 'height';

				if (propertys.indexOf(index) < 0) propertys.push(index);
			}
		}

		return propertys;
	},
	killTweensOf: function killTweensOf(agile, complete) {
		if (Utils.isNumber(agile)) {
			if (this.arguments['' + agile]) {
				var newagile = this.arguments['' + agile][0];
				var param = this.arguments['' + agile][2];
				var id = this.arguments['' + agile][3];
				if (id > 0) {
					clearTimeout(id);
					id = -999;
				}

				if (complete) this.set(newagile, param);
				Css.css3(newagile.element, 'transition', 'none !important');
				Css.css3(newagile.element, 'transition', 'none');

				this.removeCallback(newagile);
				delete this.arguments['' + agile];
				delete newagile.transitions['' + agile];
			}
		} else {
			for (var tweenIndex in this.arguments) {
				var arr = this.arguments[tweenIndex];

				if (arr[0] === agile) {
					var _id = arr[3];
					if (_id > 0) {
						clearTimeout(_id);
						_id = -999;
					}

					delete this.arguments[tweenIndex];
				}
			}

			if (complete) {
				if (this.oldAttribute[agile.id]) {
					for (var _tweenIndex in this.oldAttribute[agile.id]) {
						for (var p in this.oldAttribute[agile.id][_tweenIndex]) {
							agile[p] = this.oldAttribute[agile.id][_tweenIndex][p];
						}

						delete this.oldAttribute[agile.id][_tweenIndex];
					}
				}
			}

			Utils.destroyObject(agile.transitions);
			delete this.oldAttribute[agile.id];
			this.removeCallback(agile);

			Css.css3(agile.element, 'transition', 'none !important');
			Css.css3(agile.element, 'transition', 'none');
		}
	},
	killAll: function killAll(complete) {
		for (var agileID in this.oldAttribute) {
			var agile = Agile.getEleById(agileID);
			this.killTweensOf(agile, complete);
		}
	},
	set: function set(agile, paramsObj) {
		agile.css3('transition');

		for (var index in paramsObj) {
			var newIndex = '_' + index + '_';
			var i = this.getKeywordString().search(new RegExp(newIndex, 'i'));

			if (i <= -1) {
				var j = Agile.keyword.search(new RegExp(newIndex, 'i'));
				if (j <= -1) {
					if (index.indexOf('-') > -1) {
						var arr = index.split('-');
						for (var _i = 0; _i < arr.length; _i++) {
							if (_i !== 0) arr[_i] = arr[_i].charAt(0).toUpperCase() + arr[_i].substr(1);
						}

						agile.css2(arr.join(''), paramsObj[index]);
					} else {
						agile.css2(index, paramsObj[index]);
					}
				} else {
					agile[index] = paramsObj[index];
				}
			}
		}
	},
	remove: function remove(agile, tweenIndex) {
		delete agile.transitions['' + tweenIndex];
		var transitions = JsonUtils.object2String(agile.transitions);
		Css.css3(agile.element, 'transition', transitions);
	},
	getKeywordString: function getKeywordString() {
		if (!this.keywordString) this.keywordString = '_' + this.keyword.join('_') + '_';
		return this.keywordString;
	},
	addCallback: function addCallback(agile) {
		var _this2 = this;

		if (this.callbacks[agile.id]) return this.callbacks[agile.id];

		this.callbacks[agile.id] = {
			fun: function fun(e) {
				var callback = _this2.callbacks[agile.id];
				for (var index in agile.transitions) {
					if (agile.transitions[index].indexOf(e.propertyName) > -1) {
						_this2.remove(agile, index);
						_this2.deleteOldAttribute(agile, index);

						if (callback.completes[index]) {
							var completes = callback.completes[index];
							if (completes.length === 1) completes[0].apply(agile);else completes[0].apply(agile, completes[1]);

							try {
								delete callback.completes[index];
							} catch (e) {
								//
							}
						}
					}
				}
			},
			completes: {}
		};

		this.getPrefixEvent();
		agile.element.addEventListener(this.transitionend, this.callbacks[agile.id].fun, false);

		return this.callbacks[agile.id];
	},
	removeCallback: function removeCallback(agile) {
		if (this.callbacks[agile.id]) {
			var callback = this.callbacks[agile.id];
			this.getPrefixEvent();
			agile.element.removeEventListener(this.transitionend, callback.fun, false);

			if (callback.completes) Utils.destroyObject(callback.completes);
			Utils.destroyObject(callback);

			delete this.callbacks[agile.id];
		}
	},
	getPrefixEvent: function getPrefixEvent() {
		if (!this.transitionend) {
			var prefix = Css.getPrefix();
			switch (prefix) {
				case 'Webkit':
					this.transitionend = 'webkitTransitionEnd';
					break;
				case 'ms':
					this.transitionend = 'MSTransitionEnd';
					break;
				case 'O':
					this.transitionend = 'oTransitionEnd';
					break;
				case 'Moz':
					this.transitionend = 'transitionend';
					break;
				default:
					this.transitionend = 'transitionend';
			}
		}
	},
	getOldAttribute: function getOldAttribute(agile, tweenIndex) {
		if (!this.oldAttribute[agile.id]) this.oldAttribute[agile.id] = {};
		if (!this.oldAttribute[agile.id][tweenIndex]) this.oldAttribute[agile.id][tweenIndex] = {};

		return this.oldAttribute[agile.id][tweenIndex];
	},
	deleteOldAttribute: function deleteOldAttribute(agile, tweenIndex) {
		if (this.oldAttribute[agile.id]) {
			delete this.oldAttribute[agile.id][tweenIndex];

			if (Utils.isEmpty(this.oldAttribute[agile.id])) delete this.oldAttribute[agile.id];
		}
	}
};

Agile$1.Css = Css;

Agile$1.DisplayObject = DisplayObject;
Agile$1.Container = Container;
Agile$1.Circle = Circle;
Agile$1.Dom = Dom;
Agile$1.Ellipse = Ellipse;
Agile$1.Image = AgileImage;
Agile$1.Line = Line;
Agile$1.MovieClip = MovieClip;
Agile$1.Rect = Rect;
Agile$1.SpriteSheet = SpriteSheet;
Agile$1.Text = Text;
Agile$1.Triangle = Triangle;
Agile$1.ScrollingBg = ScrollingBg;
Agile$1.Semicircle = Semicircle;

Agile$1.Color = Color$1;
Agile$1.Filter = Filter;
Agile$1.Utils = Utils;
Agile$1.LoadManager = LoadManager;

Agile$1.MovieClipLabel = MovieClipLabel;
Agile$1.Keyframes = Keyframes;
Agile$1.Timeline = Timeline;
Agile$1.Tween = Tween;
Agile$1.ease = ease;

Agile$1.gradient = Color$1.gradient.bind(Color$1);

Object.assign(Agile$1, ease);

return Agile$1;

})));
//# sourceMappingURL=agile.js.map
