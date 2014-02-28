/**
 * @author a-jie https://github.com/a-jie
 */
(function(Agile, undefined) {
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
})(Agile);
