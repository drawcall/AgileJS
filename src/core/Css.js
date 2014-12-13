(function(Agile, document, undefined) {
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
})(Agile, document);
