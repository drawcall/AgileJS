/*!
 * Agile v0.1.6
 * https://github.com/a-jie/Agile
 *
 * Copyright 2011-2015, A-JIE
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license
 *
 */

(function(window, document) {
    var Agile = window.Agile || {
        _avatar: {
            mode: '2d',
            support3d: true,
            backface: true
        },
        keywordArr: ['x', 'y', 'z', 'width', 'height', 'color', 'regX', 'regY', 'alpha', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY', 'zIndex','round','radius','radiusX','radiusY', 'originalWidth', 'originalHeight'],
        perspective: 500,
        defaultDepth: 100,
        agileObjs: {},
        containers: [],
        getAgileByID: function(id) {
            return Agile.agileObjs[id];
        },
        get keyword() {
            if (!Agile._avatar.keyword) Agile._avatar.keyword = '_' + Agile.keywordArr.join('_') + '_';
            return Agile._avatar.keyword;
        },
        get transform() {
            if (!Agile._avatar.transform) Agile._avatar.transform = Agile.Css.getPrefix(2) + 'transform';
            return Agile._avatar.transform;
        },
        get transformOrigin() {
            if (!Agile._avatar.transformOrigin) Agile._avatar.transformOrigin = Agile.Css.getPrefix(2) + 'transform-origin';
            return Agile._avatar.transformOrigin;
        },
        get mode() {
            return this._avatar.mode;
        },
        set mode(mode) {
        	if(this.support3d)
            	this._avatar.mode = mode;
            else
            	this._avatar.mode = '2d';
        },
        get support3d(){
        	if(this._avatar.support3d)
        		return this._avatar.support3d;
        	else 
        		return this._avatar.support3d = Agile.Css.support3d();
        },
        get backface() {
        	return this._avatar.backface;
        },
        set backface(backface) {
        	this._avatar.backface = backface;
        	for(var agile in Agile.agileObjs)
        	{
        		agile.backface = backface;
        	}
        }
    }

    Agile.GROUP_LOADED = 'groupLoaded';
    Agile.SINGLE_LOADED = 'singleLoaded';
    Agile.LOAD_ERROR = 'loadError';
    Agile.IMAGE_LOADED = 'imageLoaded';
	Agile.getAgileById = Agile.getAgileByID;
	
    window.Agile = Agile;


	var Css = Css || {
		select : function(type) {
			if (type.indexOf('#') == 0 || type.indexOf('.') == 0 || type == 'body')
				return document.querySelector(type);
			else
				return document.getElementById(type);
		},

		createElement : function(tag) {
			var tag = tag || "div";
			var div = document.createElement(tag);
			return div;
		},

		css : function(element, style, value) {
			if ( typeof style == 'object') {
				var value = value || 2;
				for (var ss in style) {
					if (value == 2)
						Css.css2(element, ss, style[ss]);
					else
						Css.css3(element, ss, style[ss]);
				}
				return null;
			} else {
				return Css.css2(element, style, value);
			}
		},

		css2 : function(element, style, value) {
			if (!(value === undefined)) {
				element.style['' + style] = value;
				return value;
			} else {
				var computedStyle = getComputedStyle(element, '');
				return element.style['' + style] || computedStyle.getPropertyValue('' + style);
			}
		},

		css3j : function(element, style, value) {
			element.style[style] = '-webkit-' + value;
			element.style[style] = '-moz-' + value;
			element.style[style] = '-ms-' + value;
			element.style[style] = '-o-' + value;
			element.style[style] = '' + value;
		},

		css3 : function(element, style, value) {
			var fixStyle = style.charAt(0).toUpperCase() + style.substr(1);
			if (!(value === undefined)) {
				element.style['Webkit' + fixStyle] = value;
				element.style['Moz' + fixStyle] = value;
				element.style['ms' + fixStyle] = value;
				element.style['O' + fixStyle] = value;
				element.style['' + style] = value;
			} else {
				return Css.getCss3(element, style);
			}
		},

		getCss3 : function(element, style) {
			var computedStyle = getComputedStyle(element, '');
			var a = element.style['' + style] || element.style['-webkit-' + style] || element.style['-o-' + style] || element.style['-ms-' + style] || element.style['-moz-' + style];
			var b = computedStyle.getPropertyValue('' + style) || computedStyle.getPropertyValue('-webkit- ' + style) || computedStyle.getPropertyValue('-o-' + style) || computedStyle.getPropertyValue('-ms-' + style) || computedStyle.getPropertyValue('-moz-' + style);
			return a || b;
			
			// var computedStyle = getComputedStyle(element, '');
			// var a = element.style['' + style] || element.style['Webkit' + fixStyle] || element.style['Moz' + fixStyle] || element.style['O' + fixStyle] || element.style['ms' + fixStyle];
			// var b = computedStyle.getPropertyValue('' + style) || computedStyle.getPropertyValue('Webkit' + fixStyle) || computedStyle.getPropertyValue('Moz' + fixStyle) || computedStyle.getPropertyValue('O' + fixStyle) || computedStyle.getPropertyValue('ms' + fixStyle);
			// return a || b;
		},

		bakCss3 : function(element, style, value) {
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

		addClass : function(element, newClassName) {
			var className = element.className;
			var blank = (className != '') ? ' ' : '';
			if (!Css.hasClass(element, newClassName))
				element.className = className + blank + newClassName;
		},

		removeClass : function(element, cls) {
            if (this.hasClass(element,cls)) {
                var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
                element.className = element.className.replace(reg,'');
            }
		},

		hasClass : function(element, className) {
			return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
		},

		getDynamicSheet : function() {
			if (!Css['dynamicSheet']) {
				var style = document.createElement('style');
				style.rel = 'stylesheet';
				style.type = 'text/css';
				document.getElementsByTagName('head')[0].appendChild(style);
				Css['dynamicSheet'] = style.sheet;
			}
			return Css['dynamicSheet'];
		},

		getTestElement : function() {
			if (!Css['testElement'])
				Css['testElement'] = document.createElement("div");
			return Css['testElement'];
		},

		getPrefix : function(type) {
			var prefix = '';
			var type = type || 1;
			var prefixs = ["Moz", 'Webkit', 'ms', 'O', ''];
			for (var i = 0, length = prefixs.length; i < length; i++) {
				var css3Prefix = prefixs[i];
				if ((css3Prefix + "Transition") in Css.getTestElement().style) {
					if (type != 1) {
						prefix = css3Prefix.toLocaleLowerCase();
						if (prefix !== '')
							prefix = '-' + prefix + '-';
					} else {
						prefix = css3Prefix;
					}
					return prefix;
				}
			}
			return prefix;
		},
		
		support3d : function() {
			var el = document.createElement('p'), support3d, transforms = {
				'webkitTransform' : '-webkit-transform',
				'OTransform' : '-o-transform',
				'msTransform' : '-ms-transform',
				'MozTransform' : '-moz-transform',
				'transform' : 'transform'
			};

			document.body.insertBefore(el, null);
			for (var t in transforms) {
				if (el.style[t] !== undefined) {
					el.style[t] = "translate3d(1px,1px,1px)";
					support3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
				}
			}
			document.body.removeChild(el);
			return (support3d !== undefined && support3d.length > 0 && support3d !== "none");
		}
	}

	Agile.Css = Css;



	var EventDispatcher = function() {
	}

	EventDispatcher.prototype = {

		constructor : EventDispatcher,

		apply : function(object) {

			object.addEventListener = EventDispatcher.prototype.addEventListener;
			object.hasEventListener = EventDispatcher.prototype.hasEventListener;
			object.removeEventListener = EventDispatcher.prototype.removeEventListener;
			object.dispatchEvent = EventDispatcher.prototype.dispatchEvent;

		},

		addEventListener : function(type, listener) {

			if (this._listeners === undefined)
				this._listeners = {};

			var listeners = this._listeners;

			if (listeners[type] === undefined) {

				listeners[type] = [];

			}

			if (listeners[type].indexOf(listener) === -1) {

				listeners[type].push(listener);

			}

		},

		hasEventListener : function(type, listener) {

			if (this._listeners === undefined)
				return false;

			var listeners = this._listeners;

			if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {

				return true;

			}

			return false;

		},

		removeEventListener : function(type, listener) {

			if (this._listeners === undefined)
				return;

			var listeners = this._listeners;
			var listenerArray = listeners[type];

			if (listenerArray !== undefined) {

				var index = listenerArray.indexOf(listener);

				if (index !== -1) {

					listenerArray.splice(index, 1);

				}

			}

		},

		dispatchEvent : function() {

			var array = [];

			return function(event) {

				if (this._listeners === undefined)
					return;

				var listeners = this._listeners;
				var listenerArray = listeners[event.type];

				if (listenerArray !== undefined) {

					event.target = this;

					var length = listenerArray.length;

					for (var i = 0; i < length; i++) {

						array[i] = listenerArray[i];

					}

					for (var i = 0; i < length; i++) {

						array[i].call(this, event);

					}

				}

			};

		}()
	};
	Agile.EventDispatcher = EventDispatcher;



	function Filter(type) {
		this.type = type;
		this.agiles = [];
		this.styleObj = {};
		this.arguments = arguments;
		this.a = this.b = this.c = this.d = this.e = this.f = this.g = null;
	}


	Filter.prototype.apply = function(agile) {
		this.agiles.push(agile);
		this.styleObj[agile.id] = {
			style : '',
			value : ''
		};

		if (this.type == 'stroke') {
			this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
			this.b = this.arguments.length > 2 ? this.arguments[2] : '#000';
		} else if (this.type == 'blur') {
			this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
			this.b = this.arguments.length > 2 ? this.arguments[2] : '#000';
		} else if (this.type == 'shadow') {
			this.a = this.arguments.length > 1 ? this.arguments[1] : 3;
			this.b = this.arguments.length > 2 ? this.arguments[2] : 3;
			this.c = this.arguments.length > 3 ? this.arguments[3] : 5;
			this.d = this.arguments.length > 4 ? this.arguments[4] : '#000';
		} else if (this.type == 'glow') {
			this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
			this.b = this.arguments.length > 2 ? this.arguments[2] : '#000';
		} else if (this.type == 'insetglow' || this.type == 'insetGlow' || this.type == 'inset-glow') {
			this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
			this.b = this.arguments.length > 2 ? this.arguments[2] : '#000';
		} else if (this.type == '3d') {
			this.a = this.arguments.length > 1 ? this.arguments[1] : 6;
			this.b = this.arguments.length > 2 ? this.arguments[2] : '#000';
		}

		this.reset(agile);
	}

	Filter.prototype.reset = function(agile) {
		var thisAgiles = agile == undefined ? this.agiles : [agile];
		for (var i = 0, length = thisAgiles.length; i < length; i++) {
			var agile = thisAgiles[i];
			this.styleObj[agile.id].value = '';
			if (this.type == 'stroke') {
				if ( agile instanceof Agile.Text) {
					var s1 = (-this.a) + 'px ' + (-this.a) + 'px 0 ' + this.b;
					var s2 = (this.a) + 'px ' + (-this.a) + 'px 0 ' + this.b;
					var s3 = (-this.a) + 'px ' + (this.a) + 'px 0 ' + this.b;
					var s4 = (this.a) + 'px ' + (this.a) + 'px 0 ' + this.b;
					this.styleObj[agile.id].value = s1 + ',' + s2 + ',' + s3 + ',' + s4;console.log(this.styleObj[agile.id].value)
				} else {
					this.styleObj[agile.id].value = '0 0 0 ' + this.a + 'px ' + this.b;
				}
			} else if (this.type == 'blur') {
				Agile.Css.css2(agile.element, 'color', Agile.Color.alpha0);
				Agile.Css.css3(agile.element, 'background', Agile.Color.alpha0);
				this.styleObj[agile.id].value = '0 0 ' + this.a + 'px ' + this.b;
			} else if (this.type == 'shadow') {
				this.styleObj[agile.id].value = this.a + 'px ' + this.b + 'px ' + this.c + 'px ' + this.d;
			} else if (this.type == 'glow') {
				this.styleObj[agile.id].value = '0 0 ' + this.a + 'px ' + this.b;
			} else if (this.type == 'insetglow' || this.type == 'insetGlow' || this.type == 'inset-glow') {
				this.styleObj[agile.id].value = 'inset 0 0 ' + this.a + 'px ' + this.b;
			} else if (this.type == '3d') {
				for (var i = 0, length = this.a; i < length; i++) {
					if (i == length - 1)
						this.styleObj[agile.id].value += (i + 1) + 'px ' + (i + 1) + 'px ' + this.b;
					else
						this.styleObj[agile.id].value += (i + 1) + 'px ' + (i + 1) + 'px ' + this.b + ',';
				}
			}

			if ( agile instanceof Agile.Text)
				this.styleObj[agile.id].style = 'textShadow';
			else
				this.styleObj[agile.id].style = 'boxShadow';

			Agile.Css.css3(agile.element, this.styleObj[agile.id].style, this.styleObj[agile.id].value);
		}
	}

	Filter.prototype.erase = function(agile) {
		Agile.Utils.arrayRemove(this.agiles, agile);
		Agile.Css.css3(agile.element, this.styleObj[agile.id].style, null);
		delete this.styleObj[agile.id];
	}

	Agile.Filter = Filter;



	var IDUtils = Agile.IDUtils || {
		_idhash : {},
		getID : function(name) {
			if (!this._idhash[name])
				this._idhash[name] = 0;
			return name + '_' + (this._idhash[name]++);
		}
	}

	Agile.IDUtils = IDUtils;



	var JsonUtils = Agile.JsonUtils || {
		object2Json : function(obj) {
			var t = typeof (obj);
			if (t != "object" || obj === null) {
				if (t == "string")
					obj = '' + obj + '';
				return String(obj);
			} else {
				var n, v, json = [], arr = (obj && obj.constructor == Array);
				for (n in obj) {
					v = obj[n];
					t = typeof (v);
					if (t == "string") {
						//v = '"' + v + '"';
					} else {
						if (t == "object" && v !== null) {
							v = JsonUtils.object2Json(v);
						}
					}
					json.push(( arr ? '' : '' + n + ':') + String(v));
				}
				var j = json.join("; ");

				return ( arr ? "[" : "{") + j + ( arr ? "]" : "}");
			}
		},

		object2String : function(obj) {
			var str = '';
			for (var index in obj) {
				str += obj[index] + ', ';
			}
			str = str.substr(0, str.length - 2);
			return str;
		},

		replaceChart : function(json) {
			var reg1 = new RegExp('%:', 'g');
			var reg2 = new RegExp('};', 'g');
			json = json.replace(reg1, '%');
			json = json.replace(reg2, '}');
			return json;
		}
	}

	Agile.JsonUtils = JsonUtils;



	var Utils = Agile.Utils || {
		inherits : function(subClass, superClass) {
			subClass._super_ = superClass;
			if (Object['create']) {
				subClass.prototype = Object.create(superClass.prototype, {
					constructor : {
						value : subClass
					}
				});
			} else {
				var F = function() {
				};
				F.prototype = superClass.prototype;
				subClass.prototype = new F();
				subClass.prototype.constructor = subClass;
			}
		},

		keys : function(object) {
			if (!Object.keys) {
				Object.keys = function(obj) {
					var keys = [];
					for (var i in obj) {
						if (obj.hasOwnProperty(i))
							keys.push(i);
					}
					return keys;
				};
			}
			
			return Object.keys(object);
		},

		extend : function(a, b) {
			for (var i in b ) {
				var g = b.__lookupGetter__(i), s = b.__lookupSetter__(i);

				if (g || s) {
					if (g)
						a.__defineGetter__(i, g);
					if (s)
						a.__defineSetter__(i, s);
				} else
					a[i] = b[i];
			}
			return a;
		},

		isNumber : function(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},

		isArray : function(value) {
			if ( value instanceof Array || (!( value instanceof Object) && (Object.prototype.toString.call((value)) == '[object Array]') || typeof value.length == 'number' && typeof value.splice != 'undefined' && typeof value.propertyIsEnumerable != 'undefined' && !value.propertyIsEnumerable('splice'))) {
				return true;
			} else {
				return false;
			}
		},

		isEmpty : function(obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop))
					return false;
			}

			return true;
		},

		arrayRemove : function(arr, val) {
			var index = arr.indexOf(val);
			if (index > -1) {
				arr.splice(index, 1);
			}
		},

		destroyObject : function(obj) {
			for (var o in obj)
			delete obj[o];
		},

		objectforkey : function(obj, value) {
			for (var key in obj) {
				var index = obj[key].indexOf(value);
				if (index == 0 && obj[key].charAt(index + value.length) == ' ')
					return key;
			}
			return null;
		},

		initValue : function(a, b) {
			var s = (a === undefined || a === null) ? b : a;
			return s;
		},

		otherToFloat : function(str, wh) {
			var wh = wh || 1;
			if (Utils.isNumber(str)) {
				if (str <= 1)
					return str;
				else
					return str / wh;
			} else if ( typeof str == 'string') {
				if (str.indexOf('%') > -1) {
					str = str.substring(0, str.length - 1);
					str = parseFloat(str) / 100;
				} else if (str == 'left' || str == 'top') {
					str = 0;
				} else if (str == 'right' || str == 'bottom') {
					str = 1;
				} else if (str == 'center' || str == 'center') {
					str = .5;
				} else {
					str = parseFloat(str);
					if (str <= 1)
						return str;
					else
						return str / wh;
				}
			}

			return str;
		},

		getStyleBySpace : function(str, index) {
			if (!str)
				return null;
			var arr = str.split(' ');
			if (index >= arr.lenght)
				return null;
			else
				return arr[index];
		},

		getCssValue : function(agile, style, index, css3) {
			if (css3 == 3)
				var str = Utils.getStyleBySpace(agile.css3(style), index);
			else
				var str = Utils.getStyleBySpace(agile.css2(style), index);

			if (str)
				return Utils.otherToFloat(str);
			else
				return null;
		},

		getTransformAttribute : function(agile, style) {
			var transform = agile.css3('transform');
			var start = transform.indexOf(style);
			var end = transform.indexOf(")", start) + 1;
			return transform.substring(start, end);
		},

		getTransformSubAttribute : function(transform, index) {
			var arr = transform.split(',');
			var tra = arr[index];
			if (index == 0) {
				var start = tra.indexOf("(") + 1;
				var end = tra.length;
			} else if (index == arr.length - 1) {
				var start = 0;
				var end = tra.indexOf(")");
			} else {
				var start = 0;
				var end = tra.length;
			}

			return tra.substring(start, end);
		},

		replace : function(str, a, b) {
			var s = '';
			if (Utils.isArray(a)) {
				for (var i = 0; i < a.length; i++) {
					//if (i != a.length - 1)
					s += a[i] + '|';
				}
			} else {
				s = a;
			}

			return str.replace(new RegExp(s, "gm"), b);
		}
	}

	// Define Object.create if not available
	if ( typeof Object.create !== "function") {
		Object.create = function(o) {
			function F() {
			}


			F.prototype = o;
			return new F();
		};
	}

	Agile.Utils = Utils;



	var Color = Agile.Color || {
		gradient : function(type) {
			var type = type || 'linear'
			if (type == 'linear' || type == 'line') {
				var color = 'linear-gradient(';
				for (var i = 1, length = arguments.length; i < length; i++) {
					if (i == 1 && Agile.Utils.isNumber(arguments[i]))
						color += arguments[i] + 'deg,';
					else if (i == length - 1)
						color += arguments[i] + ')';
					else
						color += arguments[i] + ',';
				}
				return color;
			} else if (type == 'radial' || type == 'rad') {
				var color = 'radial-gradient(';
				for (var i = 1, length = arguments.length; i < length; i++) {
					if (i == length - 1)
						color += arguments[i] + ')';
					else
						color += arguments[i] + ',';
				}
				return color;
			}
		},
		rgba : function(r, g, b, a) {
			var a = Agile.Utils.initValue(a, 1);
			var color = 'rbga(' + r + ',' + g + ',' + b + ',' + a + ')';
		},
		hsl : function(h, s, l, a) {
			var s = Agile.Utils.initValue(s, '100');
			var l = Agile.Utils.initValue(l, '100');
			var a = Agile.Utils.initValue(a, 1);
			var color = 'hsl(' + h + ',' + s + '%,' + l + '%,' + a + ')';
		},
		randomColor : function() {
			return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
		},
		random : function() {
			return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
		},
		alpha0 : 'transparent'
	}

	Agile.Color = Color;
	Agile.gradient = Color.gradient;



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



    function DisplayObject() {
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
            visible: true,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            skewX: 0,
            skewY: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            position: 'absolute',
            color: null,
            backgroundImage: null,
            zIndex: 0,
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
        this.zIndex = Agile.defaultDepth;
        if (this.id != '') Agile.agileObjs[this.id] = this;
    }

    DisplayObject.prototype = {
        set id(id) {
            this._avatar.id = id;
            this.element.setAttribute("id", this._avatar.id);
        },
        get id() {
            return this._avatar.id;
        },
        set x(x) {
            this._avatar.x = x;
            this.transform();
        },
        get x() {
            return this._avatar.x;
        },
        set y(y) {
            this._avatar.y = y;
            this.transform();
        },
        get y() {
            return this._avatar.y;
        },
        set z(z) {
            this._avatar.z = z;
            this.transform();
        },
        get z() {
            return this._avatar.z;
        },
        set scaleX(scaleX) {
            this._avatar.scaleX = scaleX;
            this._avatar.width = scaleX * this.originalWidth;
            this.transform();
        },
        get scaleX() {
            return this._avatar.scaleX;
        },
        set scaleY(scaleY) {
            this._avatar.scaleY = scaleY;
            this._avatar.height = scaleY * this.originalHeight;
            this.transform();
        },
        get scaleY() {
            return this._avatar.scaleY;
        },
        set scaleZ(scaleZ) {
            this._avatar.scaleZ = scaleZ;
            this.transform();
        },
        get scaleZ() {
            return this._avatar.scaleZ;
        },
        set skewX(skewX) {
            this._avatar.skewX = skewX;
            this.transform();
        },
        get skewX() {
            return this._avatar.skewX;
        },
        set skewY(skewY) {
            this._avatar.skewY = skewY;
            this.transform();
        },
        get skewY() {
            return this._avatar.skewY;
        },
        set rotationX(rotationX) {
            this._avatar.rotationX = rotationX;
            this.transform();
        },
        get rotationX() {
            return this._avatar.rotationX;
        },
        set rotationY(rotationY) {
            this._avatar.rotationY = rotationY;
            this.transform();
        },
        get rotationY() {
            return this._avatar.rotationY;
        },
        set rotationZ(rotationZ) {
            this._avatar.rotationZ = rotationZ;
            this.transform();
        },
        get rotationZ() {
            return this._avatar.rotationZ;
        },
        set rotation(rotation) {
            this._avatar.rotationZ = rotation;
            this.transform();
        },
        get rotation() {
            return this._avatar.rotationZ;
        },
        set regX(regX) {
            this._avatar.regX = regX;
            var regx = parseFloat(this.regX) * 100 + '%';
            var regy = parseFloat(this.regY) * 100 + '%';
            this.css3('transformOrigin', regx + ' ' + regy);
            this.transform();
        },
        get regX() {
            return this._avatar.regX;
        },
        set regY(regY) {
            this._avatar.regY = regY;
            var regx = parseFloat(this.regX) * 100 + '%';
            var regy = parseFloat(this.regY) * 100 + '%';
            this.css3('transformOrigin', regx + ' ' + regy);
            this.transform();
        },
        get regY() {
            return this._avatar.regY;
        },
        set regZ(regZ) {
            this._avatar.regZ = regZ;
            var regx = parseFloat(this.regX) * 100 + '%';
            var regy = parseFloat(this.regY) * 100 + '%';
            var regz = parseFloat(this.regZ) * 100 + '%';
            this.css3('transformOrigin', regx + ' ' + regy + ' ' + regz);
        },
        get regZ() {
            return this._avatar.regZ;
        },
        set originalWidth(originalWidth) {
            this._avatar.originalWidth = originalWidth;
            this.css2('width', this.originalWidth + 'px');
        },
        get originalWidth() {
            return this._avatar.originalWidth;
        },
        set originalHeight(originalHeight) {
            this._avatar.originalHeight = originalHeight;
            this.css2('height', this.originalHeight + 'px');
        },
        get originalHeight() {
            return this._avatar.originalHeight;
        },
        set width(width) {
            if (!this.originalWidth) {
                this._avatar.width = width;
                this.originalWidth = width;
            } else {
                this.scaleX = width / this.originalWidth;
            }
        },
        get width() {
            return this._avatar.width;
        },
        set height(height) {
            if (!this.originalHeight) {
                this._avatar.height = height;
                this.originalHeight = height;
            } else {
                this.scaleY = height / this.originalHeight;
            }
        },
        get height() {
            return this._avatar.height;
        },
        set visible(visible) {
            this._avatar.visible = visible;
            var vis = visible ? 'block': 'none';
            this.css2('display', vis);
        },
        get visible() {
            return this._avatar.visible;
        },
        set alpha(alpha) {
            this._avatar.alpha = alpha;
            this.css2('opacity', this.alpha);
        },
        get alpha() {
            return this._avatar.alpha;
        },
        set color(color) {
            if (color == 'random' || color == '#random') color = Agile.Color.randomColor();
            this._avatar.color = color;
            if (color.indexOf('gradient') > -1) this.css3j('background', this.color);
            else this.css2('backgroundColor', this.color);
        },
        get color() {
            return this._avatar.color;
        },
        set backgroundImage(backgroundImage) {
            this._avatar.backgroundImage = backgroundImage;
            var img = (backgroundImage != null || backgroundImage != undefined) ? 'url(' + this.backgroundImage + ')': null;
            this.css2('backgroundImage', img);
        },
        get backgroundImage() {
            return this._avatar.backgroundImage;
        },
        set position(position) {
            this._avatar.position = position;
            this.css2('position', this.position);
        },
        get position() {
            return this._avatar.position;
        },
        set zIndex(zIndex) {
            this._avatar.zIndex = zIndex;
            this.css2('zIndex', this.zIndex);
        },
        get zIndex() {
            return this._avatar.zIndex;
        },
        set mask(mask) {
            if (mask.indexOf('gradient') > -1) {
                this.css3('maskImage', mask);
            } else {
                var mask = mask ? 'url(' + mask + ')': null;
                this.css3('maskImage', mask);
            }
        },
        set select(select) {
            var select = (select == false || select == null) ? 'none': 'auto';
            this.css3('userSelect', select);
        },
        set cursor(cursor) {
            var cursor = (cursor == true || cursor == 'hand' || cursor == 'pointer') ? 'pointer': 'auto';
            this.css2('cursor', cursor);
        },
        get cursor() {
            return this.css2('cursor');
        },
        set backface(backface) {
            this._avatar.backface = backface;
            var bf = backface ? 'visible': 'hidden';
            this.css3('backfaceVisibility', bf);
        },
        get backface() {
            return this._avatar.backface;
        }
    }

    DisplayObject.prototype.createElement = function() {
        this._avatar.id = Agile.IDUtils.getID(this.toString());
        this.element = Agile.Css.createElement();
        this.element.setAttribute("id", this._avatar.id);
    }

    DisplayObject.prototype.background = function(color) {
        if (color.indexOf('.') > 0) this.backgroundImage = color;
        else this.color = color;
    }

    DisplayObject.prototype.getRealWidth = function() {
        if (!this._avatar.realWidth) this._avatar.realWidth = this.originalWidth;
        return this._avatar.realWidth * this.scaleX;
    }

    DisplayObject.prototype.getRealHeight = function() {
        if (!this._avatar.realHeight) this._avatar.realHeight = this.originalHeight;
        return this._avatar.realHeight * this.scaleY;
    }

    DisplayObject.prototype.css = function(style, value) {
        if (this.element) return Agile.Css.css(this.element, style, value);
    }

    DisplayObject.prototype.css2 = function(style, value) {
        if (this.element) return Agile.Css.css2(this.element, style, value);
    }

    DisplayObject.prototype.css3 = function(style, value) {
        if (this.element) return Agile.Css.css3(this.element, style, value);
    }

    DisplayObject.prototype.css3j = function(style, value) {
        if (this.element) Agile.Css.css3j(this.element, style, value);
    }

    DisplayObject.prototype.addClass = function(styleName) {
        if (this.element) Agile.Css.addClass(this.element, styleName);
    }

    DisplayObject.prototype.removeClass = function(styleName) {
        if (this.element) Agile.Css.removeClass(this.element, styleName);
    }

    DisplayObject.prototype.addFrame = function(duration, frameObj, parmObj) {
        return Agile.Timeline.addFrame(this, duration, frameObj, parmObj);
    }

    DisplayObject.prototype.removeFrame = function(frame, removeStyle) {
        return Agile.Timeline.removeFrame(this, frame, removeStyle);
    }

    DisplayObject.prototype.removeFrameAfter = function(frame, complete, removeStyle) {
        Agile.Timeline.removeFrameAfter(this, frame, complete, removeStyle);
    }

    DisplayObject.prototype.pause = function() {
        Agile.Timeline.pause(this);
    }

    DisplayObject.prototype.resume = function() {
        Agile.Timeline.resume(this);
    }

    DisplayObject.prototype.addChild = function(obj) {
    	this._avatar.maxChildrenDepth++;
    	obj.zIndex = Agile.defaultDepth + this._avatar.maxChildrenDepth;
    	
        if (obj.parent != this) {
            this.element.appendChild(obj.element);
            this.numChildren++;
            this.childrens.push(obj);
            obj.parent = this;
            obj.transform();

            if (!this._avatar.realWidth) this._avatar.realWidth = this.originalWidth;
            var left = Math.min(obj.x - obj.width * obj.regX, -this.width * this.regX);
            this._avatar.realWidth += Math.abs((left + this.width * this.regX));
            var right = Math.max(obj.x + obj.width * (1 - obj.regX), this.width * (1 - this.regX));
            this._avatar.realWidth += (right - this.width * (1 - this.regX));

            if (!this._avatar.realHeight) this._avatar.realHeight = this.originalHeight;
            var top = Math.min(obj.y - obj.height * obj.regY, -this.height * this.regY);
            this._avatar.realHeight += Math.abs((top + this.height * this.regY));
            var bottom = Math.max(obj.y + obj.height * (1 - obj.regY), this.height * (1 - this.regY));
            this._avatar.realHeight += (bottom - this.height * (1 - this.regY));
        }

        return obj;
    }

    DisplayObject.prototype.addChildAt = function(obj, index) {
        this.addChild(obj);
        obj.zIndex = index;
    }

    DisplayObject.prototype.removeChild = function(obj) {
        if (obj.parent == this) {
            this.element.removeChild(obj.element);
            this.numChildren--;
            Agile.Utils.arrayRemove(this.childrens, obj);
            obj.zIndex = Agile.defaultDepth;
            obj.parent = null;
            obj.transform();
        }
    }

    DisplayObject.prototype.addFilter = function(filter) {
        this.filters.push(filter);
        filter.apply(this);
    }

    DisplayObject.prototype.removeFilter = function(filter) {
        Agile.Utils.arrayRemove(this.filters, filter);
        filter.erase(this);
    }

    DisplayObject.prototype.addEventListener = function(type, listener, useCapture) {
        this.element.addEventListener(type, listener, useCapture);
    }

    DisplayObject.prototype.removeEventListener = function(type, listener, useCapture) {
        this.element.removeEventListener(type, listener, useCapture);
    }

    DisplayObject.prototype.transform = function() {
        if (Agile.mode == '3d' && Agile.support3d) {
            var parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth: 0;
            var parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight: 0;
            var thisOffsetX = this.regX * this.originalWidth;
            var thisOffsetY = this.regY * this.originalHeight;
            var translate = 'translate3d(' + (this.x - thisOffsetX + parentOffsetX) + 'px,' + (this.y - thisOffsetY + parentOffsetY) + 'px,' + this.z + 'px) ';
            var rotate = 'rotateX(' + this.rotationX + 'deg) ' + 'rotateY(' + this.rotationY + 'deg) ' + 'rotateZ(' + this.rotationZ + 'deg) ';
            var scale = 'scale3d(' + this.scaleX + ',' + this.scaleY + ',' + this.scaleZ + ') ';
            var skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';
            this.css3('transform', translate + rotate + scale + skew);
        } else {
            var parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth: 0;
            var parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight: 0;
            var thisOffsetX = this.regX * this.originalWidth;
            var thisOffsetY = this.regY * this.originalHeight;
            var translate = 'translate(' + (this.x - thisOffsetX + parentOffsetX) + 'px,' + (this.y - thisOffsetY + parentOffsetY) + 'px) ';
            var rotate = 'rotate(' + this.rotationZ + 'deg) ';
            var scale = 'scale(' + this.scaleX + ',' + this.scaleY + ') ';
            var skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';
            this.css3('transform', translate + rotate + scale + skew);
        }
    }

    DisplayObject.prototype.toString = function() {
        return 'DisplayObject';
    }

    DisplayObject.prototype.destroy = function() {
        for (var i = 0; i < this.childrens.length; i++) this.childrens[i].destroy();

        Agile.Utils.destroyObject(this.childrens);
        delete Agile.agileObjs[this.id];
        this.parent = null;
        this.filters = null;
        Agile.Timeline.kill(this);
        Agile.Tween.killTweensOf(this);
    }

    Agile.DisplayObject = DisplayObject;


	function Rect(width, height, color) {
		Rect._super_.call(this);
		this.width = width || 50;
		this.height = height || this.width;
		var color = color || 'blue';
		this.background(color);
		this.x = this.y = 0;
	}


	Agile.Utils.inherits(Rect, Agile.DisplayObject);
	Rect.prototype.__defineGetter__('round', function() {
		return this._avatar.round;
	});
	Rect.prototype.__defineSetter__('round', function(round) {
		this._avatar.round = round;
		this.css3('borderRadius', this.round + 'px');
	});
	Rect.prototype.toString = function() {
		return 'Rect';
	}

	Agile.Rect = Rect;



	function Circle(radius, color) {
		Circle._super_.call(this);
		this.radius = radius || 25;
		var color = color || 'purple';
		this.background(color);
		this.x = this.y = 0;
	}


	Agile.Utils.inherits(Circle, Agile.DisplayObject);
	Circle.prototype.__defineGetter__('radius', function() {
		return this._avatar.radius;
	});
	Circle.prototype.__defineSetter__('radius', function(radius) {
		this._avatar.radius = radius;
		this.width = this.height = this.radius * 2;
		this.css3('borderRadius', '50%');
	});

	Circle.prototype.toString = function() {
		return 'Circle';
	}

	Agile.Circle = Circle;



	function Ellipse(radiusX, radiusY, color) {
		Ellipse._super_.call(this);
		this.radiusX = radiusX || 50;
		this.radiusY = radiusY || 25;
		var color = color || 'purple';
		this.background(color);
		this.x = this.y = 0;
	}


	Agile.Utils.inherits(Ellipse, Agile.DisplayObject);
	Ellipse.prototype.__defineGetter__('radiusX', function() {
		return this._avatar.radiusX;
	});
	Ellipse.prototype.__defineSetter__('radiusX', function(radiusX) {
		this._avatar.radiusX = radiusX;
		this.width = this.radiusX * 2;
		this.css3('borderRadius', this.radiusX + 'px' + ' / ' + this.radiusY + 'px');
	});

	Ellipse.prototype.__defineGetter__('radiusY', function() {
		return this._avatar.radiusY;
	});
	Ellipse.prototype.__defineSetter__('radiusY', function(radiusY) {
		this._avatar.radiusY = radiusY;
		this.height = this.radiusY * 2;
		this.css3('borderRadius', this.radiusX + 'px' + ' / ' + this.radiusY + 'px');
	});

	Ellipse.prototype.toString = function() {
		return 'Ellipse';
	}

	Agile.Ellipse = Ellipse;



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



	function MovieClip(image, width, height, labels, speed) {
		this.widthSize = true;
		this.heightSize = true;
		MovieClip._super_.call(this, image, width, height);
		this.originalHeight = height;
		this.originalWidth = width;

		this._avatar.currentFrame = 1;
		if (labels)
			this.setLabel(labels);
		this.labels = {};
		this.speed = speed || .6;
		this.loop = true;
		this.stop();
	}


	Agile.Utils.inherits(MovieClip, Agile.Image);

	MovieClip.prototype.__defineGetter__('currentFrame', function() {
		//sorry this have a lot of bugs i am fixing
		var totalframes = this.labels[this.label]['totalframes'];
		var w = this.labels[this.label]['width'];
		var h = this.labels[this.label]['height'];
		if (h == 0) {
			var length = Agile.Utils.getCssValue(this, 'backgroundPosition', 0, 2);
			this._avatar.currentFrame = length * totalframes / w;
		} else {
			var length = Agile.Utils.getCssValue(this, 'backgroundPosition', 1, 2);
			this._avatar.currentFrame = length * totalframes / h;
		}

		return this._avatar.currentFrame;
	});

	MovieClip.prototype.__defineGetter__('label', function() {
		return this._avatar.label;
	});

	MovieClip.prototype.__defineSetter__('label', function(label) {
		if (this.labels[label]) {
			this._avatar.label = label;
			var frame = this.labels[label]['frame'];
			var totalframes = this.labels[label]['totalframes'];

			if (Agile.Timeline.indexOf(frame) <= -1)
				Agile.Timeline.insertKeyframes(this, frame);

			var loop = this.loop ? -1 : 0;
			Agile.Timeline.removeFrameByIndex(this, this.currentTimelineIndex);
			this.currentTimelineIndex = Agile.Timeline.playFrame(this, this.speed, frame, {
				loop : loop,
				ease : 'steps(' + totalframes + ')'
			});

			this.totalframes = totalframes;
			this.play();
		}
	});

	MovieClip.prototype.__defineGetter__('speed', function() {
		return this._avatar.speed;
	});

	MovieClip.prototype.__defineSetter__('speed', function(speed) {
		this._avatar.speed = speed;
		if (this.labels[this.label]) {
			Agile.Timeline.removeFrameByIndex(this, this.currentTimelineIndex);

			var loop = this.loop ? -1 : 0;
			var frame = this.labels[this.label]['frame'];
			var totalframes = this.labels[this.label]['totalframes'];
			Agile.Timeline.removeFrameByIndex(this, this.currentTimelineIndex);
			this.currentTimelineIndex = Agile.Timeline.playFrame(this, this.speed, frame, {
				loop : loop,
				ease : 'steps(' + totalframes + ')'
			});
		}

		this.play();
	});

	MovieClip.prototype.stop = function() {
		this.playing = false;
		this.pause();
	}

	MovieClip.prototype.play = function(label) {
		if (this.recordLabel) {
			this.animations[this.recordLabel.index] = this.recordLabel.frame;
			var animation = Agile.JsonUtils.object2String(this.animations);
			this.css3('animation', animation);
		}

		this.playing = true;
		this.resume();
	}

	MovieClip.prototype.gotoAndPlay = function(frameNumber) {
		if ( typeof frameNumber == 'string') {
			this.label = frameNumber;
		} else {
			frameNumber--;
			var to = this.labels[this.label]['to'];
			var totalframes = this.labels[this.label]['totalframes'];
			var w = this.labels[this.label]['width'];
			var h = this.labels[this.label]['height'];
			if (h == 0) {
				var length = w * frameNumber / totalframes;
				var position = -length + 'px ' + -to.y + 'px';
			} else {
				var length = h * frameNumber / totalframes;
				var position = -to.x + 'px ' + -length + 'px';
			}

			this.css2('backgroundPosition', position);
			var animation = Agile.JsonUtils.object2String(this.animations);
			this.css3('animation', animation);
			this.play();
		}
	}

	MovieClip.prototype.gotoAndStop = function(frameNumber) {
		if ( typeof frameNumber == 'string') {
			this.label = frameNumber;
		} else {
			frameNumber--;
			var to = this.labels[this.label]['to'];
			var totalframes = this.labels[this.label]['totalframes'];
			var w = this.labels[this.label]['width'];
			var h = this.labels[this.label]['height'];
			if (h == 0) {
				var length = w * frameNumber / totalframes;
				var position = -length + 'px ' + -to.y + 'px';
			} else {
				var length = h * frameNumber / totalframes;
				var position = -to.x + 'px ' + -length + 'px';
			}

			this.css2('backgroundPosition', position);
			var frames = Agile.Timeline.removeFrameByIndex(this, this.currentTimelineIndex);

			this.recordLabel = {
				frame : frames,
				index : this.currentTimelineIndex
			};
		}
	}

	MovieClip.prototype.setLabel = function(label, from, to, totalframes) {
		if ( typeof label == 'object') {
			if (label['from'] && label['to']) {
				var frome = label['from'];
				var to = label['to'];
				var l = label['label'];
				var frame = label['totalframes']
				return this.setLabel(l, frome, to, frame);
			} else {
				for (var l in label) {
					var frome = label[l]['from'];
					var to = label[l]['to'];
					var frame = label[l]['totalframes']
					return this.setLabel(l, frome, to, frame);
				}
			}
		} else {
			this.labels[label] = this.makeFrame(from, to, totalframes);
			this.label = label;
		}

		return this.labels[label];
	}

	MovieClip.prototype.makeFrame = function(from, to, totalframes) {
		var from = from || {
			x : '0px',
			y : '0px'
		};
		var to = to || {
			x : '-200%',
			y : '0px'
		};
		var width = Math.abs(parseFloat(to.x - from.x));
		var height = Math.abs(parseFloat(to.y - from.y));
		var keyframes = new Agile.Keyframes();

		var fromX = -from.x;
		var fromY = -from.y;
		var toX = -to.x;
		var toY = -to.y;

		keyframes.add(0, {
			'background-position' : fromX + 'px ' + fromY + 'px'
		});

		keyframes.add(100, {
			'background-position' : toX + 'px ' + toY + 'px'
		});

		return {
			frame : keyframes,
			totalframes : totalframes,
			width : width,
			height : height,
			from : from,
			to : to
		};
	}

	MovieClip.prototype.toString = function() {
		return 'MovieClip';
	}

	Agile.MovieClip = MovieClip;



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



    var _intervalID;

    function SpriteSheet(imgArr, width, height, speed, useIntervl, useCssSprite) {
        SpriteSheet._super_.call(this);
        _intervalID = -1;
        this.imgArr = imgArr;
        if (typeof speed == 'boolean') {
            this.speed = 30;
            this.useCssSprite = this.speed;
        } else {
            this.speed = speed || 30;
            this.useCssSprite = useCssSprite || false;
        }
        this.useIntervl = useIntervl || true;
        this.state = 'stop';
        this.originalHeight = height;
        this.originalWidth = width;
        this.currentFrame = 1;
        this.prevFrame = this.currentFrame;
        this.totalFrames = imgArr.length;
        this.setBackgroundImage();
        this.loop = true;
        this.prvePlay = false;
        this.elapsed = 0;
        this.stop();
    }

    Agile.Utils.inherits(SpriteSheet, Agile.DisplayObject);

    SpriteSheet.prototype.setBackgroundImage = function () {
        if (this.useCssSprite) {
            this.removeClass(this.imgArr[this.prevFrame - 1]);
            this.addClass(this.imgArr[this.currentFrame - 1]);
        } else {
            this.backgroundImage = this.imgArr[this.currentFrame - 1];
        }
    }

    SpriteSheet.prototype.play = function () {
        if (this.useIntervl) {
            var _self = this;
            if (_intervalID < 0)
                _intervalID = setInterval(function () {
                    _self.update.apply(_self);
                }, 1000 / this.speed);
        }
        this.state = 'play';
    }

    SpriteSheet.prototype.stop = function (clear) {
        if (this.useIntervl && clear) {
            clearInterval(_intervalID);
            _intervalID = -1;
        }
        this.state = 'stop';
    }

    SpriteSheet.prototype.gotoAndPlay = function (frame) {
        this.currentFrame = frame;
        this.setBackgroundImage();
        this.play();
        this.state = 'play';
    }

    SpriteSheet.prototype.gotoAndStop = function (frame) {
        this.currentFrame = frame;
        this.setBackgroundImage();
        this.stop();
        this.state = 'stop';
    }

    SpriteSheet.prototype.update = function () {
        if (this.state == 'stop')
            return;

        if (!this.useIntervl) {
            if (!this.oldTime)
                this.oldTime = new Date().getTime();
            var time = new Date().getTime();
            this.elapsed += (time - this.oldTime);
            this.oldTime = time;

            if (this.elapsed >= 1000 / this.speed) {
                this.elapsed = this.elapsed % (1000 / this.speed);
            } else {
                return;
            }
        }

        this.render();
    }

    SpriteSheet.prototype.render = function () {
        //The use of two times for a reason
        if (this.state == 'stop')
            return;

        this.prevFrame = this.currentFrame;

        if (this.prvePlay)
            this.currentFrame--;
        else
            this.currentFrame++;

        if (this.prvePlay) {
            if (this.loop) {
                if (this.currentFrame < 1)
                    this.currentFrame = this.totalFrames;
            } else {
                if (this.currentFrame <= 1) {
                    this.currentFrame = 1;
                    this.stop();
                }
            }
        } else {
            if (this.loop) {
                if (this.currentFrame > this.totalFrames)
                    this.currentFrame = 1;
            } else {
                if (this.currentFrame >= this.totalFrames) {
                    this.currentFrame = this.totalFrames;
                    this.stop();
                }
            }
        }

        this.setBackgroundImage();
    }

    SpriteSheet.prototype.toString = function () {
        return 'SpriteSheet';
    }

    Agile.SpriteSheet = SpriteSheet;



	function Avatar(width, height, color) {
		Avatar._super_.call(this);
		this.width = width || 50;
		this.height = height || this.width;
		var color = color || 'blur';
		this.background(color);
		this.x = this.y = 0;
		this.parent = {
			originalWidth : 0,
			originalHeight : 0,
			regX : 0,
			regY : 0
		};
	}


	Agile.Utils.inherits(Avatar, Agile.DisplayObject);

	Avatar.prototype.clearStyle = function() {
		this.css3('transform', '');
		this.element.style.cssText = '';
		this.element.style = '';
	}

	Avatar.prototype.copyParent = function(parent) {
		this.parent.regX = parent.regX;
		this.parent.regY = parent.regY;
		this.parent.originalWidth = parent.originalWidth;
		this.parent.originalHeight = parent.originalHeight;
	}

	Avatar.prototype.copySelf = function(self, all) {
		this.regX = self.regX;
		this.regY = self.regY;
		this.originalWidth = self.originalWidth;
		this.originalHeight = self.originalHeight;
		if (self.parent)
			this.copyParent(self.parent);

		if (all) {
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

	Avatar.prototype.toString = function() {
		return 'Avatar';
	}

	Agile.Avatar = Avatar;



	var Tween = Agile.Tween || {
		'keyword' : ['ease', 'delay', 'yoyo', 'all', 'loop', 'repeat', 'frame', 'onStart', 'onUpdate', 'onComplete', 'onCompleteParams', 'overwrite', 'setTimeout'],
		callbacks : {},
		arguments : {},
		oldAttribute : {},
		//To fix css3 transform bugs using setTimeout., But doing so will lose a lot of efficiency。
		setTimeout : true,
		timeoutDelay : 30,
		index : 0
	}

	Tween.to = function(agile, duration, paramsObj) {
		var propertys = paramsObj['all'] ? ['all'] : Tween.apply(agile, paramsObj, Tween.index);
		var transition = '';

		for (var i = 0; i < propertys.length; i++) {
			if (i > 0)
				transition += ', ';
			transition += propertys[i];
			transition += ' ' + duration + 's';
			if (paramsObj['ease'])
				transition += ' ' + paramsObj['ease'];
			if (paramsObj['delay'])
				transition += ' ' + paramsObj['delay'] + 's';
		}

		var id = -999;
		var isSetTimeout = false;
		isSetTimeout = paramsObj.setTimeout === undefined ? Tween.setTimeout : paramsObj.setTimeout;
		
		if (isSetTimeout) {
			id = setTimeout(function(agile, transition, paramsObj, tweenIndex) {
				Tween.start(agile, transition, paramsObj, tweenIndex);
				id = -999;
			}, Tween.timeoutDelay, agile, transition, paramsObj, Tween.index);
		} else {
			Tween.start(agile, transition, paramsObj, Tween.index);
		}

		Tween.arguments[Tween.index + ''] = [agile, duration, paramsObj, id];
		return Tween.index++;
	}

	Tween.start = function(agile, transition, paramsObj, tweenIndex) {
		if (paramsObj['overwrite']) {
			Tween.killTweensOf(agile);
			Agile.Utils.destroyObject(agile.transitions);
			agile.transitions[tweenIndex + ''] = transition;
		} else {
			var preTransition = Agile.Utils.isEmpty(agile.transitions) || Agile.JsonUtils.object2String(agile.transitions) == 'none' ? '' : Agile.Css.css3(agile.element, 'transition') + ', ';
			agile.transitions[tweenIndex + ''] = transition;
			transition = preTransition + transition;
		}

		Agile.Css.css3(agile.element, 'transition', transition);
		Tween.set(agile, paramsObj);

		Tween.addCallback(agile);
		if (paramsObj['onStart']) {
			var delay = paramsObj['delay'] || 0;
			setTimeout(paramsObj['onStart'], delay * 1000);
		}

		if (paramsObj['onComplete']) {
			if (paramsObj['onCompleteParams'])
				Tween.callbacks[agile.id].completes[tweenIndex + ''] = [paramsObj['onComplete'], paramsObj['onCompleteParams']];
			else
				Tween.callbacks[agile.id].completes[tweenIndex + ''] = [paramsObj['onComplete']];
		}
	}

	Tween.from = function(agile, duration, paramsObj) {
		var toObj = {};
		for (var index in paramsObj) {
			var newIndex = '_' + index + '_';
			var i = Tween.getKeywordString().search(new RegExp(newIndex, 'i'));
			if (i == -1) {
				toObj[index] = agile[index];
				agile[index] = paramsObj[index];
			} else {
				toObj[index] = paramsObj[index];
			}
		}

		return Tween.to(agile, duration, toObj);
	}

	Tween.fromTo = function(agile, duration, fromObj, toObj) {
		for (var index in fromObj) {
			var newIndex = '_' + index + '_';
			var i = Tween.getKeywordString().search(new RegExp(newIndex, 'i'));
			if (i == -1)
				agile[index] = fromObj[index];
		}

		return Tween.to(agile, duration, toObj);
	}

	Tween.apply = function(agile, paramsObj, tweenIndex) {
		var propertys = [];
		for (var index in paramsObj) {
			var newIndex = '_' + index + '_';
			var i = Tween.getKeywordString().search(new RegExp(newIndex, 'i'));
			if (i <= -1) {
				Tween.getOldAttribute(agile,tweenIndex)[index] = agile[index];

				if (index == 'alpha')
					index = 'opacity';
				else if (index == 'color' && !( agile instanceof Agile.Text))
					index = 'background-color';
				else if (index == 'x' || index == 'y' || index == 'z')
					index = Agile.transform;
				else if (index == 'scaleX' || index == 'scaleY' || index == 'scaleZ')
					index = Agile.transform;
				else if (index == 'rotationX' || index == 'rotation' || index == 'rotationY' || index == 'rotationZ')
					index = Agile.transform;
				else if (index == 'skewX' || index == 'skewY')
					index = Agile.transform;
				else if (index == 'regX' || index == 'regY')
					index = Tween.Agile.transformOrigin;
				else if (index == 'width' || index == 'height')
					index = Agile.transform;
				else if (index == 'originalWidth')
					index = 'width';
				else if (index == 'originalHeight')
					index = 'height';

				if (propertys.indexOf(index) < 0)
					propertys.push(index);
			}
		}

		return propertys;
	}

	Tween.killTweensOf = function(agile, complete) {
		if (Agile.Utils.isNumber(agile)) {
			if (Tween.arguments[agile + '']) {
				var newagile = Tween.arguments[agile+''][0];
				var param = Tween.arguments[agile+''][2];
				var id = Tween.arguments[agile+''][3];
				if (id > 0) {
					clearTimeout(id);
					id = -999;
				}
				if (complete)
					Tween.set(newagile, param);

				Agile.Css.css3(newagile.element, 'transition', 'none !important');
				Agile.Css.css3(newagile.element, 'transition', 'none');
				Tween.removeCallback(newagile);
				delete Tween.arguments[agile + ''];
				delete newagile.transitions[agile + ''];
			}
		} else {
			for (var tweenIndex in Tween.arguments) {
				var arr = Tween.arguments[tweenIndex];
				if (arr[0] == agile) {
					var id = arr[3];
					if (id > 0) {
						clearTimeout(id);
						id = -999;
					}
					
					delete Tween.arguments[tweenIndex];
				}
			}
			
			if (complete) {
				if (Tween.oldAttribute[agile.id]) {
					for (var tweenIndex in Tween.oldAttribute[agile.id]) {
						for (var p in Tween.oldAttribute[agile.id][tweenIndex]) {
							agile[p] = Tween.oldAttribute[agile.id][tweenIndex][p];
						}
						delete Tween.oldAttribute[agile.id][tweenIndex];
					}
				}
			}
			
			Agile.Utils.destroyObject(agile.transitions);
			delete Tween.oldAttribute[agile.id];
			Tween.removeCallback(agile);
			Agile.Css.css3(agile.element, 'transition', 'none !important');
			Agile.Css.css3(agile.element, 'transition', 'none');
		}
	}

	Tween.killAll = function(complete) {
		for (var agileID in Tween.oldAttribute) {
			var agile = Agile.getAgileByID(agileID);
			Tween.killTweensOf(agile, complete);
		}
	}

	Tween.set = function(agile, paramsObj) {
		agile.css3('transition');
		for (var index in paramsObj) {
			var newIndex = '_' + index + '_';
			var i = Tween.getKeywordString().search(new RegExp(newIndex, 'i'));
			if (i <= -1) {
				var j = Agile.keyword.search(new RegExp(newIndex, 'i'));
				if (j <= -1) {
					if (index.indexOf('-') > -1) {
						var arr = index.split('-');
						for (var i = 0; i < arr.length; i++) {
							if (i != 0)
								arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
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
	}

	Tween.remove = function(agile, tweenIndex) {
		tweenIndex = tweenIndex + '';
		delete agile.transitions[tweenIndex];
		var transitions = Agile.JsonUtils.object2String(agile.transitions);
		Agile.Css.css3(agile.element, 'transition', transitions);
	}

	Tween.getKeywordString = function() {
		if (!Tween.keywordString)
			Tween.keywordString = '_' + Tween.keyword.join('_') + '_';
		return Tween.keywordString;
	}

	Tween.addCallback = function(agile) {
		if (!Tween.callbacks[agile.id]) {
			Tween.callbacks[agile.id] = {
				fun : function(e) {
					for (var tweenIndex in agile.transitions) {
						if (agile.transitions[tweenIndex].indexOf(e.propertyName) > -1) {
							Tween.remove(agile, tweenIndex);
							Tween.deleteOldAttribute(agile, tweenIndex);

							if (Tween.callbacks[agile.id].completes[tweenIndex]) {
								if (Tween.callbacks[agile.id].completes[tweenIndex].length == 1)
									Tween.callbacks[agile.id].completes[tweenIndex][0].apply(agile);
								else
									Tween.callbacks[agile.id].completes[tweenIndex][0].apply(agile, Tween.callbacks[agile.id].completes[tweenIndex][1]);

								try {
									delete Tween.callbacks[agile.id].completes[tweenIndex];
								} catch(e) {
									//
								}
							}
						}
					}
				},
				completes : {}
			}

			Tween.prefixEvent();
			agile.element.addEventListener(Tween.transitionend, Tween.callbacks[agile.id].fun, false);
		}

		return Tween.callbacks[agile.id];
	}

	Tween.removeCallback = function(agile) {
		if (Tween.callbacks[agile.id]) {
			Tween.prefixEvent();
			agile.element.removeEventListener(Tween.transitionend, Tween.callbacks[agile.id].fun, false);
			if(Tween.callbacks[agile.id].completes)
				Agile.Utils.destroyObject(Tween.callbacks[agile.id].completes);
			Agile.Utils.destroyObject(Tween.callbacks[agile.id]);
			
			delete Tween.callbacks[agile.id];
		}
	}

	Tween.prefixEvent = function() {
		if (!Tween.transitionend) {
			var prefix = Agile.Css.getPrefix();
			switch(prefix) {
				case 'Webkit':
					Tween.transitionend = 'webkitTransitionEnd';
					break;
				case 'ms':
					Tween.transitionend = 'MSTransitionEnd';
					break;
				case 'O':
					Tween.transitionend = 'oTransitionEnd';
					break;
				case 'Moz':
					Tween.transitionend = 'transitionend';
					break;
				default:
					Tween.transitionend = 'transitionend';
			}
		}
	}

	Tween.getOldAttribute = function(agile, tweenIndex) {
		if (!Tween.oldAttribute[agile.id])
			Tween.oldAttribute[agile.id] = {};
		if (!Tween.oldAttribute[agile.id][tweenIndex])
			Tween.oldAttribute[agile.id][tweenIndex] = {};
		return Tween.oldAttribute[agile.id][tweenIndex];
	}

	Tween.deleteOldAttribute = function(agile, tweenIndex) {
		if (Tween.oldAttribute[agile.id]) {
			delete Tween.oldAttribute[agile.id][tweenIndex];
			if (Agile.Utils.isEmpty(Tween.oldAttribute[agile.id]))
				delete Tween.oldAttribute[agile.id];
		}
	}

	Agile.Tween = Tween;



	var Timeline = Timeline || {
		index : 0,
		callbacks : {},
		currentTime : 0,
		nextTween : [],
		replace : false,
		remove : true,
		get avatar() {
            if (!this.avatarmc) this.avatarmc = new Agile.Avatar(1, 1);
            return this.avatarmc;
        }
	}

	/*
	 * Timeline.addFrame(mc,1.5,myKeyframe);
	 * Timeline.addFrame(mc,1.5,{frame:myKeyframe,delay:.5});
	 * Timeline.addFrame(mc,1.5,myKeyframe,{delay:.5,loop:12});
	 * Timeline.addFrame(mc,1.5,{delay:.5,loop:12},myKeyframe);
	 */
	Timeline.addFrame = function(agile, duration, frameObj, paramsObj) {
		if ( frameObj instanceof Agile.Keyframes) {
			if (!paramsObj)
				paramsObj = {}
			Timeline.insertKeyframes(agile, frameObj, paramsObj['replace']);
			Timeline.apply(agile, duration, frameObj, paramsObj);
		} else if ( typeof frameObj == 'object') {
			if (frameObj.hasOwnProperty('frame'))
				var keyframe = frameObj['frame'];
			else
				var keyframe = paramsObj;

			Timeline.insertKeyframes(agile, keyframe, frameObj['replace']);
			Timeline.apply(agile, duration, keyframe, frameObj);
		}
		
		return Timeline.index++;
	}

	Timeline.playFrame = function(agile, duration, frameObj, paramsObj) {
		if ( frameObj instanceof Agile.Keyframes) {
			if (!paramsObj)
				paramsObj = {}
			Timeline.apply(agile, duration, frameObj, paramsObj);
		} else if ( typeof frameObj == 'object') {
			if (frameObj.hasOwnProperty('frame'))
				var keyframe = frameObj['frame'];
			else
				var keyframe = paramsObj;

			Timeline.apply(agile, duration, keyframe, frameObj);
		}
		
		return Timeline.index++;
	}

	Timeline.insertKeyframes = function(agile, keyframes, replace) {
		if (replace || Timeline.replace)
			Timeline.removeKeyframes(agile.id + '_' + keyframes.label);

		var prefix = Agile.Css.getPrefix(2);
		Timeline.avatar.clearStyle();
		Timeline.avatar.copySelf(agile, 'all');
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
						for (var i = 0; i < arr.length; i++) {
							if (i != 0)
								arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
						}
						Timeline.avatar.css2(arr.join(''), timeObj[style]);
					} else {
						Timeline.avatar.css2(style, timeObj[style]);
					}
				} else {
					Timeline.avatar[style] = timeObj[style];
				}

				if (style == 'alpha') {
					keys[time]['opacity'] = Timeline.avatar[style];
				} else if (style == 'color' && !( agile instanceof Agile.Text)) {
					keys[time]['background-color'] = Timeline.avatar[style];
				} else if (style == 'x' || style == 'y' || style == 'z') {
					keys[time][prefix + 'transform'] = Timeline.avatar.css3('transform');
				} else if (style == 'scaleX' || style == 'scaleY' || style == 'scaleZ') {
					keys[time][prefix + 'transform'] = Timeline.avatar.css3('transform');
				} else if (style == 'rotationX' || style == 'rotationY' || style == 'rotationZ' || style == 'rotation') {
					keys[time][prefix + 'transform'] = Timeline.avatar.css3('transform');
				} else if (style == 'skewX' || style == 'skewY') {
					keys[time][prefix + 'transform'] = Timeline.avatar.css3('transform');
				} else if (style == 'width' || style == 'height') {
					keys[time][prefix + 'transform'] = Timeline.avatar.css3('transform');
				} else if (style == 'regX' || style == 'regY') {
					keys[time][prefix + 'transform-origin'] = Timeline.avatar.css3('transformOrigin');
				} else if (style == 'originalWidth') {
					keys[time]['width'] = Timeline.avatar.css2('width');
				} else if (style == 'originalHeight') {
					keys[time]['height'] = Timeline.avatar.css2('height');
				} else if(style == 'round') {
					keys[time]['border-radius'] = Timeline.avatar[style] + 'px';
				} else {
					keys[time][style] = Timeline.avatar.css2(style);
				}
			}
		}

		var keyframesTag = '@' + Agile.Css.getPrefix(2) + 'keyframes';
		var styles = Agile.Css.getDynamicSheet();
		var paramsObj = Agile.JsonUtils.object2Json(keys);
		paramsObj = Agile.JsonUtils.replaceChart(paramsObj);
		var css = keyframesTag + ' ' + agile.id + '_' + keyframes.label + paramsObj;
		styles.insertRule(css, styles.cssRules.length);
		styles = null;
	}

	Timeline.apply = function(agile, duration, keyframe, paramsObj) {
		var animation = '';
		var label = typeof keyframe == 'string' ? keyframe : keyframe.label;
		animation += agile.id + '_' + label + ' ';
		animation += duration + 's ';
		if (paramsObj['ease'])
			animation += paramsObj['ease'] + ' ';
		if (paramsObj['delay'])
			animation += paramsObj['delay'] + 's ';

		if (paramsObj['loop']) {
			if (paramsObj['loop'] <= 0)
				paramsObj['loop'] = 'infinite';
			animation += paramsObj['loop'] + ' ';
		} else if (paramsObj['repeat']) {
			if (paramsObj['repeat'] <= 0)
				paramsObj['repeat'] = 'infinite';
			animation += paramsObj['repeat'] + ' ';
		}
		if (paramsObj['yoyo']) {
			if (paramsObj['yoyo'] == true)
				paramsObj['yoyo'] = 'alternate';
			if (paramsObj['yoyo'] == false)
				paramsObj['yoyo'] = 'normal';
			animation += paramsObj['yoyo'] + ' ';
		}

		animation += 'forwards';

		var preTransition = Agile.Utils.isEmpty(agile.animations) ? '' : Agile.Css.css3(agile.element, 'animation') + ', ';
		agile.animations[Timeline.index + ''] = animation;
		animation = preTransition + animation;
		agile.css3('animation', animation);

		Timeline.addCallback(agile);
		Timeline.callbacks[agile.id].sets[Timeline.index + ''] = keyframe.merge();
		Timeline.callbacks[agile.id].removes[Timeline.index + ''] = (paramsObj['remove'] || Timeline.remove);
		if (paramsObj['onComplete']) {
			if (paramsObj['onCompleteParams'])
				Timeline.callbacks[agile.id].completes[Timeline.index + ''] = [paramsObj['onComplete'], paramsObj['onCompleteParams']];
			else
				Timeline.callbacks[agile.id].completes[Timeline.index + ''] = [paramsObj['onComplete']];
		}
	}

	Timeline.removeKeyframes = function(frame) {
		var name = typeof frame == 'string' ? frame : frame.label;
		var styles = Agile.Css.getDynamicSheet();
		var rules = styles.cssRules || styles.rules || [];
		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i];
			if (rule.type === CSSRule.KEYFRAMES_RULE || rule.type === CSSRule.MOZ_KEYFRAMES_RULE || rule.type === CSSRule.WEBKIT_KEYFRAMES_RULE || rule.type === CSSRule.O_KEYFRAMES_RULE || rule.type === CSSRule.MS_KEYFRAMES_RULE) {
				if (rule.name == name) {
					styles.deleteRule(i);
				}
			}
		}
	}

	Timeline.indexOf = function(keyName) {
		var name = typeof keyName == 'string' ? keyName : keyName.label;
		var styles = Agile.Css.getDynamicSheet();
		var rules = styles.cssRules || styles.rules || [];
		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i];
			if (rule.type === CSSRule.KEYFRAMES_RULE || rule.type === CSSRule.MOZ_KEYFRAMES_RULE || rule.type === CSSRule.WEBKIT_KEYFRAMES_RULE || rule.type === CSSRule.O_KEYFRAMES_RULE || rule.type === CSSRule.MS_KEYFRAMES_RULE) {
				if (rule.name == keyName) {
					return 100;
				}
			}
		}

		return -100;
	}

	Timeline.pause = function(agile) {
		Agile.Css.css3(agile.element, 'animationPlayState', 'paused');
	}

	Timeline.resume = function(agile) {
		Agile.Css.css3(agile.element, 'animationPlayState', 'running');
	}

	Timeline.toggle = function(agile) {
		if (Agile.Css.css3(agile.element, 'animationPlayState') == 'running')
			Timeline.pause(agile);
		else
			Timeline.resume(agile);
	}

	Timeline.removeFrameByIndex = function(agile, index) {
		index = index + '';
		var deleteItem = agile.animations[index];
		if (deleteItem) {
			agile.animations[index] = '0';
			var animation = Agile.JsonUtils.object2String(agile.animations);
			if (Agile.Utils.replace(animation, ['0,', '0', ' '], '') == '')
				Timeline.removeAllFrames(agile);
			else
				agile.css3('animation', animation);
		}
		return deleteItem;
	}

	Timeline.removeFrame = function(agile, frame, removeStyle) {
		if (Agile.Utils.isNumber(frame)) {
			var timelineIndex = frame;
			var keyframes = agile.animations[timelineIndex + ''];
		} else if ( typeof frame == 'string') {
			if (frame.indexOf(agile.id) > -1)
				var keyframes = frame;
			else
				var keyframes = agile.id + '_' + frame;
			var timelineIndex = Agile.Utils.objectforkey(agile.animations, keyframes);
		} else {
			var keyframes = agile.id + '_' + frame.label;
			var timelineIndex = Agile.Utils.objectforkey(agile.animations, keyframes);
		}
		if (removeStyle)
			Timeline.removeKeyframes(keyframes);
		return Timeline.removeFrameByIndex(agile, timelineIndex);
	}

	Timeline.removeFrameAfter = function(agile, frame, complete, removeStyle) {
		Timeline.prefixEvent();
		agile.element.addEventListener(Timeline.animationiteration, animationiterationHandler, false);
		function animationiterationHandler(e) {
			Timeline.removeFrame(agile, frame, removeStyle);
			agile.element.removeEventListener(Timeline.animationiteration, animationiterationHandler);
            if(complete)
                complete();
		}

	}

	Timeline.removeAllFrames = function(agile) {
		for (var index in agile.animations)
		delete agile.animations[index];
		Agile.Css.css3(agile.element, 'animation', '');
	}

	Timeline.kill = function(agile) {
		Timeline.removeAllFrames(agile);
		if (Timeline.callbacks[agile.id]) {
			Timeline.prefixEvent();
			agile.element.removeEventListener(Timeline.animationend, Timeline.callbacks[agile.id].fun);
			delete Timeline.callbacks[agile.id];
		}
	}

	Timeline.set = function(agile, frameObj) {
		if (!frameObj)
			return;
		for (var style in frameObj) {
			var newIndex = '_' + style + '_';
			var i = Agile.keyword.search(new RegExp(newIndex, 'i'));
			if (i <= -1) {
				if (style.indexOf('-') > -1) {
					var arr = style.split('-');
					for (var i = 0; i < arr.length; i++) {
						if (i != 0)
							arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
					}
					agile.css2(arr.join(''), frameObj[style]);
				} else {
					agile.css2(style, frameObj[style]);
				}
			} else {
				agile[style] = frameObj[style];
			}
		}
	}

	Timeline.addCallback = function(agile) {
		if (!Timeline.callbacks[agile.id]) {
			Timeline.callbacks[agile.id] = {
				fun : function(e) {
					for (var timelineIndex in agile.animations) {
						if (agile.animations[timelineIndex].indexOf(e.animationName) == 0) {
							Timeline.removeFrame(agile, timelineIndex, Timeline.callbacks[agile.id].removes[timelineIndex]);
							delete Timeline.callbacks[agile.id].removes[timelineIndex];

							Timeline.set(agile, Timeline.callbacks[agile.id].sets[timelineIndex]);
							delete Timeline.callbacks[agile.id].sets[timelineIndex];

							if (Timeline.callbacks[agile.id].completes[timelineIndex]) {
								if (Timeline.callbacks[agile.id].completes[timelineIndex].length == 1)
									Timeline.callbacks[agile.id].completes[timelineIndex][0].apply(agile);
								else
									Timeline.callbacks[agile.id].completes[timelineIndex][0].apply(agile, Timeline.callbacks[agile.id].completes[timelineIndex][1]);
								try{
									delete Timeline.callbacks[agile.id].completes[timelineIndex];
								}catch(e){}
							}
						}
					}
				},
				completes : {},
				removes : {},
				sets : {}
			}

			Timeline.prefixEvent();
			agile.element.addEventListener(Timeline.animationend, Timeline.callbacks[agile.id].fun, false);
		}

		return Timeline.callbacks[agile.id];
	}

	Timeline.prefixEvent = function() {
		if (!Timeline.animationend) {
			var prefix = Agile.Css.getPrefix();
			switch(prefix) {
				case 'Webkit':
					Timeline.animationend = 'webkitAnimationEnd';
					Timeline.animationiteration = 'webkitAnimationIteration';
					break;
				case 'ms':
					Timeline.animationend = 'MSAnimationEnd';
					Timeline.animationiteration = 'MSAnimationIteration';
					break;
				case 'O':
					Timeline.animationend = 'oanimationend';
					Timeline.animationiteration = 'oanimationiteration';
					break;
				case 'Moz':
					Timeline.animationend = 'animationend';
					Timeline.animationiteration = 'animationiteration';
					break;
				default:
					Timeline.animationend = 'animationend';
					Timeline.animationiteration = 'animationiteration';
			}
		}
	}

	Agile.Timeline = Timeline;



	function Keyframes() {
		this.keyframes = {
			'100%' : {}
		};
		this.label = Agile.IDUtils.getID('keyframe');
		this.add.apply(this, arguments);
	}

	/*
	 * myKeyframes.add({time:15, color:'#000', x:2}, {time:25, color:'#fff'});
	 * myKeyframes.add(30, {color:'#ccc'});
	 * myKeyframes.add(60, alpha, 0);
	 * myKeyframes.add('20%', alpha, 1);
	 */
	Keyframes.prototype.add = function() {
		if ( typeof arguments[0] == 'object') {
			for (var key in arguments[0]) {
				var timevalue = arguments[0][key];
				if (Agile.Utils.isNumber(key)) {
					var time = key + '%';
				} else {
					if (key.indexOf('%') > -1)
						var time = key;
					else
						var time = key + '%';
				}
				delete arguments[0][key + ""];
				arguments[0][time] = timevalue;
				this.setColor(arguments[0][time]);
			}

			Agile.Utils.extend(this.keyframes, arguments[0]);
		} else if (Agile.Utils.isNumber(arguments[0])) {
			var time = arguments[0] + '%';
			if (arguments.length == 3) {
				var style = arguments[1];
				var value = arguments[2];
				var parmObj = {};
				parmObj[time] = {};
				parmObj[time][style] = value;
			} else {
				var value = arguments[1];
				var parmObj = {};
				parmObj[time] = value;
			}

			this.setColor(parmObj[time]);
			Agile.Utils.extend(this.keyframes, parmObj);
		} else if ((arguments[0] + '').indexOf('%') > -1) {
			var time = arguments[0];
			if (arguments.length == 3) {
				var style = arguments[1];
				var value = arguments[2];
				var parmObj = {};
				parmObj[time] = {};
				parmObj[time][style] = value;
			} else {
				var value = arguments[1];
				var parmObj = {};
				parmObj[time] = value;
			}
			this.setColor(parmObj[time]);
			Agile.Utils.extend(this.keyframes, parmObj);
		}

		this.fill();
	}

	Keyframes.prototype.get = function(time) {
		if (Agile.Utils.isNumber(time))
			time = time + '%';
		else
			time = time
		return this.Keyframes[time];
	}

	Keyframes.prototype.remove = function(time) {
		if (Agile.Utils.isNumber(time))
			time = time + '%';
		else
			time = time;

		if (time)
			delete this.Keyframes[time];
		else
			this.Keyframes.length = 0;
	}

	Keyframes.prototype.fill = function() {
		this.sort();
		var prevValue;
		for (var time in this.keyframes) {
			for (var key in prevValue) {
				if (this.keyframes[time][key] === undefined)
					this.keyframes[time][key] = prevValue[key];
			}
			prevValue = this.keyframes[time];
		}
	}

	Keyframes.prototype.sort = function() {
		var cloneObj = {};
		var keys = Agile.Utils.keys(this.keyframes);
		keys.sort(function(a, b) {
			return parseFloat(a) - parseFloat(b);
		});

		for (var i = 0, len = keys.length; i < len; i++) {
			var k = keys[i];
			cloneObj[k] = this.keyframes[k];
		}

		this.keyframes = cloneObj;
		return this.keyframes;
	}

	Keyframes.prototype.merge = function() {
		var obj = {};
		//this.sort();
		for (var time in this.keyframes) {
			for (var key in this.keyframes[time])
			obj[key] = this.keyframes[time][key];
		}
		return obj;
	}

	Keyframes.prototype.setColor = function(obj) {
		if (obj.color) {
			if (obj.color == 'random')
				obj.color = Agile.Color.randomColor();
		}
	}

	Keyframes.prototype.destroy = function() {
		Agile.Utils.destroyObject(this.keyframes);
		this.keyframes.length = 0;
	}

	Keyframes.prototype.toString = function() {
		return 'Keyframes';
	}

	Agile.Keyframes = Agile.KeyFrames = Keyframes;



	function MovieClipLabel(label, x1, y1, x2, y2, frames) {
		if ( typeof x1 == 'object') {
			this.from = x1.from;
			this.to = x1.to;
			this.label = label;
			this.totalframes = x1.totalframes || 1;
		} else {
			this.label = label;
			this.from = {
				x : x1,
				y : y1
			};
			this.to = {
				x : x2,
				y : y2
			};
			this.totalframes = frames || 1;
		}
	}


	MovieClipLabel.prototype.toString = function() {
		return 'MovieClipLabel';
	}

	Agile.MovieClipLabel = MovieClipLabel;



	var ease = Agile.ease || {
		'linear' : 'linear',
		'easeBasic' : 'ease',
		'easeInBasic' : 'ease-in',
		'easeOutBasic' : 'ease-out',
		'easeInOutBasic' : 'ease-in-out',
		'easeOutCubic' : 'cubic-bezier(.215,.61,.355,1)',
		'easeInOutCubic' : 'cubic-bezier(.645,.045,.355,1)',
		'easeInCirc' : 'cubic-bezier(.6,.04,.98,.335)',
		'easeOutCirc' : 'cubic-bezier(.075,.82,.165,1)',
		'easeInOutCirc' : 'cubic-bezier(.785,.135,.15,.86)',
		'easeInExpo' : 'cubic-bezier(.95,.05,.795,.035)',
		'easeOutExpo' : 'cubic-bezier(.19,1,.22,1)',
		'easeInOutExpo' : 'cubic-bezier(1,0,0,1)',
		'easeInQuad' : 'cubic-bezier(.55,.085,.68,.53)',
		'easeOutQuad' : 'cubic-bezier(.25,.46,.45,.94)',
		'easeInOutQuad' : 'cubic-bezier(.455,.03,.515,.955)',
		'easeInQuart' : 'cubic-bezier(.895,.03,.685,.22)',
		'easeOutQuart' : 'cubic-bezier(.165,.84,.44,1)',
		'easeInOutQuart' : 'cubic-bezier(.77,0,.175,1)',
		'easeInQuint' : 'cubic-bezier(.755,.05,.855,.06)',
		'easeOutQuint' : 'cubic-bezier(.23,1,.32,1)',
		'easeInOutQuint' : 'cubic-bezier(.86,0,.07,1)',
		'easeInSine' : 'cubic-bezier(.47,0,.745,.715)',
		'easeOutSine' : 'cubic-bezier(.39,.575,.565,1)',
		'easeInOutSine' : 'cubic-bezier(.445,.05,.55,.95)',
		'easeInBack' : 'cubic-bezier(.6,-.28,.735,.045)',
		'easeOutBack' : 'cubic-bezier(.175, .885,.32,1.275)',
		'easeInOutBack' : 'cubic-bezier(.68,-.55,.265,1.55)',
		'stepStart' : 'step-start',
		'stepStop' : 'step-stop'
	}

	Agile.ease = ease;


/**
 * @author a-jie https://github.com/a-jie
 */

	function Semicircle(radius, color) {
		Semicircle._super_.call(this);
		this.radius = radius || 25;
		var color = color || 'purple';
		this.background(color);
		this.x = this.y = 0;
	}


	Agile.Utils.inherits(Semicircle, Agile.DisplayObject);
	Semicircle.prototype.__defineGetter__('radius', function() {
		return this._avatar.radius;
	});
	Semicircle.prototype.__defineSetter__('radius', function(radius) {
		this._avatar.radius = radius;
		this.width = this.radius * 2;
		this.height = this.radius;
		this.css3('borderRadius', this.radius + 'px ' + this.radius + 'px 0 0');
	});

	Semicircle.prototype.toString = function() {
		return 'Semicircle';
	}

	Agile.Semicircle = Semicircle;


/**
 * @author a-jie https://github.com/a-jie
 */

	function ScrollingBg(image, width, height, speed, direction, backgroundWidth, backgroundHeight) {
		this.widthSize = true;
		this.heightSize = true;
		ScrollingBg._super_.call(this, image, width, height);
		this.speed = speed || 10;
		this.direction = direction || 'left';
		
		//fix background-position-y bug
		this.backgroundWidth = backgroundWidth || 0;
		this.backgroundHeight = backgroundHeight || 0;
		this.originalHeight = height;
		this.originalWidth = width;;
		this.scrolling();
	}


	Agile.Utils.inherits(ScrollingBg, Agile.Image);
	ScrollingBg.prototype.__defineGetter__('backgroundWidth', function() {
		return this._avatar.backgroundWidth;
	});

	ScrollingBg.prototype.__defineSetter__('backgroundWidth', function(backgroundWidth) {
		this._avatar.backgroundWidth = backgroundWidth;
		this.scrolling();
	});
	
	ScrollingBg.prototype.__defineGetter__('backgroundHeight', function() {
		return this._avatar.backgroundHeight;
	});

	ScrollingBg.prototype.__defineSetter__('backgroundHeight', function(backgroundHeight) {
		this._avatar.backgroundHeight = backgroundHeight;
		this.scrolling();
	});

	ScrollingBg.prototype.__defineGetter__('speed', function() {
		return this._avatar.speed;
	});

	ScrollingBg.prototype.__defineSetter__('speed', function(speed) {
		this._avatar.speed = speed;
		this.scrolling();
	});

	ScrollingBg.prototype.__defineGetter__('direction', function() {
		return this._avatar.direction;
	});

	ScrollingBg.prototype.__defineSetter__('direction', function(direction) {
		this._avatar.direction = direction;
		this.scrolling();
	});

	ScrollingBg.prototype.scrolling = function(speed, ease) {
		var ease = ease || Agile.ease.linear;
		var speed = speed || this.speed;

		if (this.scrollframes) {
			this.removeFrame(this.scrollframes);
			this.scrollframes.destroy();
		}

		this.scrollframes = new Agile.Keyframes();
		this.scrollframes.add(0, {
			'background-position' : '0% 0%'
		});
		if (this.direction == 'left') {
			var h = this.backgroundWidth ? 1 * this.backgroundWidth + 'px' : '200%';
			this.scrollframes.add(100, {
				'background-position' : h + ' 0%'
			});
		} else if (this.direction == 'right') {
			var h = this.backgroundWidth ? -1 * this.backgroundWidth + 'px' : '-200%';
			this.scrollframes.add(100, {
				'background-position' : h + ' 0%'
			});
		} else if (this.direction == 'up') {
			var h = this.backgroundHeight ? -1 * this.backgroundHeight + 'px' : '0%';
			this.scrollframes.add(100, {
				'background-position' : '0% ' + h
			});
		} else if (this.direction == 'down' || this.direction == 'bottom') {
			var h = this.backgroundHeight ? 1 * this.backgroundHeight + 'px' : '0%';
			this.scrollframes.add(100, {
				'background-position' : '0% ' + h
			});
		}

		this.addFrame(speed, this.scrollframes, {
			loop : -1,
			ease : ease
		});
	}

	ScrollingBg.prototype.toString = function() {
		return 'ScrollingBg';
	}

	Agile.ScrollingBg = ScrollingBg;


})(window,document);
/*
 * Xccessors Standard: Cross-browser ECMAScript 5 accessors
 * http://purl.eligrey.com/github/Xccessors
 *
 * 2010-06-21
 *
 * By Eli Grey, http://eligrey.com
 *
 * A shim that partially implements Object.defineProperty,
 * Object.getOwnPropertyDescriptor, and Object.defineProperties in browsers that have
 * legacy __(define|lookup)[GS]etter__ support.
 *
 * Licensed under the X11/MIT License
 *   See LICENSE.md
 */

/*jslint white: true, undef: true, plusplus: true,
 bitwise: true, regexp: true, newcap: true, maxlen: 90 */

/*! @source http://purl.eligrey.com/github/Xccessors/blob/master/xccessors-standard.js*/

( function() {
	//"use strict";
		var ObjectProto = Object.prototype, defineGetter = ObjectProto.__defineGetter__, defineSetter = ObjectProto.__defineSetter__, lookupGetter = ObjectProto.__lookupGetter__, lookupSetter = ObjectProto.__lookupSetter__, hasOwnProp = ObjectProto.hasOwnProperty;

		if (defineGetter && defineSetter && lookupGetter && lookupSetter) {

			if (!Object.defineProperty) {
				Object.defineProperty = function(obj, prop, descriptor) {
					if (arguments.length < 3) {// all arguments required
						throw new TypeError("Arguments not optional");
					}

					prop += "";
					// convert prop to string

					if (hasOwnProp.call(descriptor, "value")) {
						if (!lookupGetter.call(obj, prop) && !lookupSetter.call(obj, prop)) {
							// data property defined and no pre-existing accessors
							obj[prop] = descriptor.value;
						}

						if ((hasOwnProp.call(descriptor, "get") || hasOwnProp.call(descriptor, "set"))) {
							// descriptor has a value prop but accessor already exists
							throw new TypeError("Cannot specify an accessor and a value");
						}
					}

					// can't switch off these features in ECMAScript 3
					// so throw a TypeError if any are false
					if (!(descriptor.writable && descriptor.enumerable && descriptor.configurable)) {
						throw new TypeError("This implementation of Object.defineProperty does not support" + " false for configurable, enumerable, or writable.");
					}

					if (descriptor.get) {
						defineGetter.call(obj, prop, descriptor.get);
					}
					if (descriptor.set) {
						defineSetter.call(obj, prop, descriptor.set);
					}

					return obj;
				};
			}

			if (!Object.getOwnPropertyDescriptor) {
				Object.getOwnPropertyDescriptor = function(obj, prop) {
					if (arguments.length < 2) {// all arguments required
						throw new TypeError("Arguments not optional.");
					}

					prop += "";
					// convert prop to string

					var descriptor = {
						configurable : true,
						enumerable : true,
						writable : true
					}, getter = lookupGetter.call(obj, prop), setter = lookupSetter.call(obj, prop);

					if (!hasOwnProp.call(obj, prop)) {
						// property doesn't exist or is inherited
						return descriptor;
					}
					if (!getter && !setter) {// not an accessor so return prop
						descriptor.value = obj[prop];
						return descriptor;
					}

					// there is an accessor, remove descriptor.writable;
					// populate descriptor.get and descriptor.set (IE's behavior)
					delete descriptor.writable;
					descriptor.get = descriptor.set = undefined;

					if (getter) {
						descriptor.get = getter;
					}
					if (setter) {
						descriptor.set = setter;
					}

					return descriptor;
				};
			}

			if (!Object.defineProperties) {
				Object.defineProperties = function(obj, props) {
					var prop;
					for (prop in props) {
						if (hasOwnProp.call(props, prop)) {
							Object.defineProperty(obj, prop, props[prop]);
						}
					}
				};
			}

		}
	}()); 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
( function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	}()); 