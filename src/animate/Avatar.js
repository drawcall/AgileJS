(function(Agile, undefined) {
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
})(Agile);
