(function(Agile, undefined) {
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
})(Agile);
