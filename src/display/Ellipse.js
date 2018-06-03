import DisplayObject from './DisplayObject';

export default class Ellipse extends DisplayObject {

	constructor(radiusX = 50, radiusY = 25, color = 'purple') {
		super();

		this.radiusX = radiusX;
		this.radiusY = radiusY;

		this.background(color);
		this.x = this.y = 0;
	}

	get radiusX() {
		return this._avatar.radiusX;
	}

	set radiusX(radiusX) {
		this._avatar.radiusX = radiusX;
		this.width = this.radiusX * 2;
		this.css3('borderRadius', this.radiusX + 'px' + ' / ' + this.radiusY + 'px');
	}

	get radiusY() {
		return this._avatar.radiusY;
	}

	set radiusY(radiusY) {
		this._avatar.radiusY = radiusY;
		this.height = this.radiusY * 2;
		this.css3('borderRadius', this.radiusX + 'px' + ' / ' + this.radiusY + 'px');
	}

	toString() {
		return 'Ellipse';
	}
}