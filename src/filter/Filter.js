(function(Agile, undefined) {
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
})(Agile);
