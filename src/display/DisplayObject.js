import Agile from '../core/Agile';
import Css from '../core/Css';
import Color from '../utils/Color';
import Utils from '../utils/Utils';
import IDUtils from '../utils/IDUtils';

export default class DisplayObject {

    constructor() {
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
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
            skewX: 0,
            skewY: 0,
            zIndex: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            visible: true,
            position: 'absolute',
            color: null,
            backgroundImage: null,
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
        this.zIndex = Agile.DEFAULT_DEPTH;
        if (this.id !== '') Agile.agileObjs[this.id] = this;

        this.x = 0;
        this.y = 0;
    }

    set id(id) {
        this._avatar.id = id;
        Css.attr(this.element, 'id', this._avatar.id);
    }
    get id() {
        return this._avatar.id;
    }

    set x(x) {
        this._avatar.x = x;
        this.transform();
    }
    get x() {
        return this._avatar.x;
    }

    set y(y) {
        this._avatar.y = y;
        this.transform();
    }
    get y() {
        return this._avatar.y;
    }

    set z(z) {
        this._avatar.z = z;
        this.transform();
    }
    get z() {
        return this._avatar.z;
    }

    set scaleX(scaleX) {
        this._avatar.scaleX = scaleX;
        this._avatar.width = scaleX * this.originalWidth;
        this.transform();
    }
    get scaleX() {
        return this._avatar.scaleX;
    }

    set scaleY(scaleY) {
        this._avatar.scaleY = scaleY;
        this._avatar.height = scaleY * this.originalHeight;
        this.transform();
    }
    get scaleY() {
        return this._avatar.scaleY;
    }

    set scaleZ(scaleZ) {
        this._avatar.scaleZ = scaleZ;
        this.transform();
    }
    get scaleZ() {
        return this._avatar.scaleZ;
    }

    set skewX(skewX) {
        this._avatar.skewX = skewX;
        this.transform();
    }
    get skewX() {
        return this._avatar.skewX;
    }

    set skewY(skewY) {
        this._avatar.skewY = skewY;
        this.transform();
    }
    get skewY() {
        return this._avatar.skewY;
    }

    set rotationX(rotationX) {
        this._avatar.rotationX = rotationX;
        this.transform();
    }
    get rotationX() {
        return this._avatar.rotationX;
    }

    set rotationY(rotationY) {
        this._avatar.rotationY = rotationY;
        this.transform();
    }
    get rotationY() {
        return this._avatar.rotationY;
    }

    set rotationZ(rotationZ) {
        this._avatar.rotationZ = rotationZ;
        this.transform();
    }
    get rotationZ() {
        return this._avatar.rotationZ;
    }

    set rotation(rotation) {
        this._avatar.rotationZ = rotation;
        this.transform();
    }
    get rotation() {
        return this._avatar.rotationZ;
    }

    set regX(regX) {
        this._avatar.regX = regX;
        const regx = parseFloat(this.regX) * 100 + '%';
        const regy = parseFloat(this.regY) * 100 + '%';
        this.css3('transformOrigin', `${regx} ${regy}`);
        this.transform();
    }
    get regX() {
        return this._avatar.regX;
    }

    set regY(regY) {
        this._avatar.regY = regY;
        const regx = parseFloat(this.regX) * 100 + '%';
        const regy = parseFloat(this.regY) * 100 + '%';

        this.css3('transformOrigin', `${regx} ${regy}`);
        this.transform();
    }
    get regY() {
        return this._avatar.regY;
    }

    set regZ(regZ) {
        this._avatar.regZ = regZ;
        const regx = parseFloat(this.regX) * 100 + '%';
        const regy = parseFloat(this.regY) * 100 + '%';
        const regz = parseFloat(this.regZ) * 100 + '%';

        this.css3('transformOrigin', `${regx} ${regy} ${regz}`);
        this.transform();
    }
    get regZ() {
        return this._avatar.regZ;
    }

    set originalWidth(originalWidth) {
        this._avatar.originalWidth = originalWidth;
        this.css2('width', this.originalWidth + 'px');
    }
    get originalWidth() {
        return this._avatar.originalWidth;
    }

    set originalHeight(originalHeight) {
        this._avatar.originalHeight = originalHeight;
        this.css2('height', this.originalHeight + 'px');
    }
    get originalHeight() {
        return this._avatar.originalHeight;
    }

    set width(width) {
        if (!this.originalWidth) {
            this._avatar.width = width;
            this.originalWidth = width;
        } else {
            this.scaleX = width / this.originalWidth;
        }
    }
    get width() {
        return this._avatar.width;
    }

    set height(height) {
        if (!this.originalHeight) {
            this._avatar.height = height;
            this.originalHeight = height;
        } else {
            this.scaleY = height / this.originalHeight;
        }
    }
    get height() {
        return this._avatar.height;
    }

    set visible(visible) {
        this._avatar.visible = visible;
        const vis = visible ? 'block' : 'none';
        this.css2('display', vis);
    }
    get visible() {
        return this._avatar.visible;
    }

    set alpha(alpha) {
        this._avatar.alpha = alpha;
        this.css2('opacity', this.alpha);
    }
    get alpha() {
        return this._avatar.alpha;
    }

    set color(color) {
        if (color === 'random' || color === '#random') color = Color.randomColor();
        this._avatar.color = color;

        if (color.indexOf('gradient') > -1) this.css3j('background', this.color);
        else this.css2('backgroundColor', this.color);
    }
    get color() {
        return this._avatar.color;
    }

    set backgroundImage(backgroundImage) {
        this._avatar.backgroundImage = backgroundImage;

        const img = (backgroundImage !== null || backgroundImage !== undefined) ? `url(${this.backgroundImage})` : null;
        this.css2('backgroundImage', img);
    }
    get backgroundImage() {
        return this._avatar.backgroundImage;
    }

    set position(position) {
        this._avatar.position = position;
        this.css2('position', this.position);
    }
    get position() {
        return this._avatar.position;
    }

    set zIndex(zIndex) {
        this._avatar.zIndex = zIndex;
        this.css2('zIndex', this.zIndex);
    }
    get zIndex() {
        return this._avatar.zIndex;
    }

    set mask(mask) {
        if ((mask + '').indexOf('gradient') > -1) {
            this.css3('maskImage', mask);
        } else {
            mask = mask ? `url(${mask})` : null;
            this.css3('maskImage', mask);
        }
    }
    set select(select) {
        select = (select === false || select === null) ? 'none' : 'auto';
        this.css3('userSelect', select);
    }

    set cursor(cursor) {
        cursor = (cursor === true || cursor === 'hand' || cursor === 'pointer') ? 'pointer' : 'auto';
        this.css2('cursor', cursor);
    }
    get cursor() {
        return this.css2('cursor');
    }

    set backface(backface) {
        this._avatar.backface = backface;
        const bf = backface ? 'visible' : 'hidden';
        this.css3('backfaceVisibility', bf);
    }
    get backface() {
        return this._avatar.backface;
    }

    createElement() {
        this._avatar.id = IDUtils.generateID(this.toString());
        this.element = Css.createElement();
        Css.attr(this.element, 'id', this._avatar.id);
    }

    background(color) {
        if (color.indexOf('.') > 0) this.backgroundImage = color;
        else this.color = color;
    }

    getRealWidth() {
        if (!this._avatar.realWidth) this._avatar.realWidth = this.originalWidth;
        return this._avatar.realWidth * this.scaleX;
    }

    getRealHeight() {
        if (!this._avatar.realHeight) this._avatar.realHeight = this.originalHeight;
        return this._avatar.realHeight * this.scaleY;
    }

    css(style, value) {
        if (this.element) return Css.css(this.element, style, value);
    }

    css2(style, value) {
        if (this.element) return Css.css2(this.element, style, value);
    }

    css3(style, value) {
        if (this.element) return Css.css3(this.element, style, value);
    }

    css3j(style, value) {
        if (this.element) Css.css3j(this.element, style, value);
    }

    addClass(styleName) {
        if (this.element) Css.addClass(this.element, styleName);
    }

    removeClass(styleName) {
        if (this.element) Css.removeClass(this.element, styleName);
    }

    addFrame(duration, frameObj, parmObj) {
        return Agile.Timeline.addFrame(this, duration, frameObj, parmObj);
    }

    removeFrame(frame, removeStyle) {
        return Agile.Timeline.removeFrame(this, frame, removeStyle);
    }

    removeFrameAfter(frame, complete, removeStyle) {
        Agile.Timeline.removeFrameAfter(this, frame, complete, removeStyle);
    }

    pause() {
        Agile.Timeline.pause(this);
    }

    resume() {
        Agile.Timeline.resume(this);
    }

    addChild(child) {
        this._avatar.maxChildrenDepth++;
        child.zIndex = Agile.DEFAULT_DEPTH + this._avatar.maxChildrenDepth;

        if (child.parent !== this) {
            this.element.appendChild(child.element);
            this.numChildren++;
            this.childrens.push(child);
            child.parent = this;
            child.transform();

            if (!this._avatar.realWidth) this._avatar.realWidth = this.originalWidth;
            const left = Math.min(child.x - child.width * child.regX, -this.width * this.regX);
            this._avatar.realWidth += Math.abs((left + this.width * this.regX));

            const right = Math.max(child.x + child.width * (1 - child.regX), this.width * (1 - this.regX));
            this._avatar.realWidth += (right - this.width * (1 - this.regX));

            if (!this._avatar.realHeight) this._avatar.realHeight = this.originalHeight;
            const top = Math.min(child.y - child.height * child.regY, -this.height * this.regY);
            this._avatar.realHeight += Math.abs((top + this.height * this.regY));

            const bottom = Math.max(child.y + child.height * (1 - child.regY), this.height * (1 - this.regY));
            this._avatar.realHeight += (bottom - this.height * (1 - this.regY));
        }

        return child;
    }

    addChildAt(child, index) {
        this.addChild(child);
        child.zIndex = index;
    }

    removeChild(child) {
        if (child.parent === this) {
            this.element.removeChild(child.element);
            this.numChildren--;
            Utils.arrayRemove(this.childrens, child);

            child.zIndex = Agile.DEFAULT_DEPTH;
            child.parent = null;
            child.transform();
        }
    }

    addFilter(filter) {
        this.filters.push(filter);
        filter.apply(this);
    }

    removeFilter(filter) {
        Utils.arrayRemove(this.filters, filter);
        filter.erase(this);
    }

    addEventListener(type, listener, useCapture) {
        this.element.addEventListener(type, listener, useCapture);
    }

    removeEventListener(type, listener, useCapture) {
        this.element.removeEventListener(type, listener, useCapture);
    }

    transform() {
        let parentOffsetX, parentOffsetY, thisOffsetX, thisOffsetY, translate, rotate, scale, skew;

        if (Agile.mode === '3d' && Agile.support3d) {
            parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth : 0;
            parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight : 0;
            thisOffsetX = this.regX * this.originalWidth;
            thisOffsetY = this.regY * this.originalHeight;
            translate = 'translate3d(' + (this.x - thisOffsetX + parentOffsetX) + 'px,' + (this.y - thisOffsetY + parentOffsetY) + 'px,' + this.z + 'px) ';
            rotate = 'rotateX(' + this.rotationX + 'deg) ' + 'rotateY(' + this.rotationY + 'deg) ' + 'rotateZ(' + this.rotationZ + 'deg) ';
            scale = 'scale3d(' + this.scaleX + ',' + this.scaleY + ',' + this.scaleZ + ') ';
            skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';

            this.css3('transform', translate + rotate + scale + skew);
        } else {
            parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth : 0;
            parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight : 0;
            thisOffsetX = this.regX * this.originalWidth;
            thisOffsetY = this.regY * this.originalHeight;
            translate = 'translate(' + (this.x - thisOffsetX + parentOffsetX) + 'px,' + (this.y - thisOffsetY + parentOffsetY) + 'px) ';
            rotate = 'rotate(' + this.rotationZ + 'deg) ';
            scale = 'scale(' + this.scaleX + ',' + this.scaleY + ') ';
            skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';

            this.css3('transform', translate + rotate + scale + skew);
        }
    }

    touchStart(fun) {
        this.touchStartHandler = e => {
            const x = e['targetTouches'] ? e['targetTouches'][0].pageX : e.pageX;
            const y = e['targetTouches'] ? e['targetTouches'][0].pageY : e.pageY;
            fun(x, y, e);
        }

        const events = !Utils.isMobile() ? 'mousedown' : 'touchstart';
        this.element.addEventListener(events, this.touchStartHandler);
    }

    stopTouchStart() {
        if (this.touchStartHandler) {
            const events = !Utils.isMobile() ? 'mousedown' : 'touchstart';
            this.element.removeEventListener(events, this.touchStartHandler);
            this.touchStartHandle = null;
        }
    }

    touchMove(fun) {
        this.touchMoveHandler = e => {
            const x = e['targetTouches'] ? e['targetTouches'][0].pageX : e.pageX;
            const y = e['targetTouches'] ? e['targetTouches'][0].pageY : e.pageY;
            fun(x, y, e);
        }

        const events = !Utils.isMobile() ? 'mousemove' : 'touchmove';
        this.element.addEventListener(events, this.touchMoveHandler);
    }

    stopTouchMove() {
        if (this.touchMoveHandler) {
            const events = !Utils.isMobile() ? 'mousemove' : 'touchmove';
            this.element.removeEventListener(events, this.touchMoveHandler);
            this.touchMoveHandler = null;
        }
    }

    touchEnd(fun) {
        this.touchEndHandler = e => {
            fun(e);
        }

        const events = !Utils.isMobile() ? 'mouseup' : 'touchend';
        this.element.addEventListener(events, this.touchEndHandler);
    }

    stopTouchEnd() {
        if (this.touchEndHandler) {
            const events = !Utils.isMobile() ? 'mouseup' : 'touchend';
            this.element.removeEventListener(events, this.touchEndHandler);
            this.touchEndHandler = null;
        }
    }

    destroy() {
        for (let i = 0; i < this.childrens.length; i++)
            this.childrens[i].destroy();

        Utils.destroyObject(this.childrens);
        delete Agile.agileObjs[this.id];

        this.parent = null;
        this.filters = null;

        Agile.Timeline.kill(this);
        Agile.Tween.killTweensOf(this);
    }

    toString() {
        return 'DisplayObject';
    }
}