(function(Agile, undefined) {
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
})(Agile);
