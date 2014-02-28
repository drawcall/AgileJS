(function(Agile, undefined) {
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
})(Agile);
