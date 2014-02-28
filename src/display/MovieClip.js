(function(Agile, undefined) {
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
})(Agile);
