(function(Agile, undefined) {
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
})(Agile);