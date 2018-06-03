import Css from '../core/Css';
import DisplayObject from './DisplayObject';

export default class Line extends DisplayObject {
	constructor(size = 3, color = 'blue') {
		super();

		this.regX = 0;
		this.regY = 0;
		this._avatar.fromX = 0;
		this._avatar.fromY = 0;
		this.size = size;
		this.color = color;

		this.x = this.y = 0;
		this.lines = [];
	}

	get color() {
		return this._avatar.color;
	}
	set color(color) {
		this._avatar.color = color;
	}

	get size() {
		return this._avatar.size;
	}
	set size(size) {
		this._avatar.size = size;
	}

	moveTo(x, y) {
		this._avatar.fromX = x;
		this._avatar.fromY = y;
	}

	lineTo(x, y) {
		const x1 = this._avatar.fromX;
		const y1 = this._avatar.fromY;

		const length = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
		const angle = Math.atan2(y - y1, x - x1) * 180 / Math.PI;
		const line = Css.createElement();

		Css.css(line, {
			'backgroundColor': this.color,
			'width': length + 'px',
			'height': this.size + 'px',
			'position': 'absolute'
		});

		let translate, rotate;
		if (Agile.mode === '3d') {
			translate = `translate3d(${this._avatar.fromX}px,${this._avatar.fromY}px,0px) `;
			rotate = `rotateZ(${angle}deg)`;
		} else {
			translate = `translate(${this._avatar.fromX}px,${this._avatar.fromY}px) `;
			rotate = `rotate(${angle}deg)`;
		}

		Css.css3(line, 'transformOrigin', 'left center');
		Css.css3(line, 'transform', translate + rotate);
		this.element.appendChild(line);

		this._avatar.fromX = x;
		this._avatar.fromY = y;
		this._avatar.width = Math.max(x, this._avatar.width);
		this._avatar.height = Math.max(y, this._avatar.height);

		this.css2('width', this.width + 'px');
		this.css2('height', this.height + 'px');
		this.lines.push(line);

		return line;
	}

	curveTo(x, y, s = 0.5) {
		const x1 = this._avatar.fromX;
		const y1 = this._avatar.fromY;

		let length = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y));
		let tha = Math.PI / 4;
		length /= .707;
		length -= 4 * this.size;

		const angle = Math.atan2(y - y1, x - x1) * 180 / Math.PI;
		const line = Css.createElement();
		const w = length;
		const h = length;
		const size = Math.max(Math.abs(this.size / s), 1);

		Css.css(line, {
			'width': w + 'px',
			'height': h + 'px',
			'position': 'absolute'
		});

		Css.css(line, {
			'borderStyle': 'solid',
			'borderTopColor': this.color,
			'borderRightColor': 'transparent',
			'borderLeftColor': 'transparent',
			'borderBottomColor': 'transparent',
			'borderWidth': size + 'px'
		}, 3);

		const offsetX = w / 2 * (1 - Math.cos(tha));
		const offsetY = h / 2 * (1 - Math.sin(tha));

		let translate, rotate, scale;
		if (Agile.mode === '3d') {
			translate = 'translate3d(' + (this._avatar.fromX - offsetX) + 'px,' + (this._avatar.fromY - offsetY) + 'px,0px) ';
			rotate = 'rotateZ(' + angle + 'deg) ';
			scale = 'scale3d(1,' + s + ',1)';
		} else {
			translate = 'translate(' + (this._avatar.fromX - offsetX) + 'px,' + (this._avatar.fromY - offsetY) + 'px) ';
			rotate = 'rotate(' + angle + 'deg)';
			scale = 'scale(1,' + s + ')';
		}

		Css.css3(line, 'transformOrigin', offsetX * 100 / w + '% ' + offsetY * 100 / w + '%');
		Css.css3(line, 'transform', translate + rotate + scale);
		Css.css3(line, 'borderRadius', '50% 50%');
		this.element.appendChild(line);

		this._avatar.fromX = x;
		this._avatar.fromY = y;
		this._avatar.width = Math.max(x, this._avatar.width);
		this._avatar.height = Math.max(y, this._avatar.height);

		this.css2('width', this.width + 'px');
		this.css2('height', this.height + 'px');
		this.lines.push(line);

		return line;
	}

	clear() {
		for (var i = 0, length = this.lines.length; i < length; i++) {
			this.element.removeChild(this.lines[i]);
			this.lines[i] = null;
		}

		this.lines.length = 0;
	}

	toString() {
		return 'Line';
	}
}