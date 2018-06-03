import DisplayObject from './DisplayObject';

export default class Text extends DisplayObject {
	constructor(text = '', size = 18, align = 'left', color = '#000') {
		super();

		this.text = text;
		this.size = size;
		this.color = color;
		this.align = align;
		this.x = this.y = 0;
		this.regX = this.regY = 0;
	}

	get height() {
		return parseFloat(this.css2('height')) || 0;
	}

	set height(height) {
		this._avatar.height = height;

		if (!this.originalHeight)
			this.originalHeight = height;
		else
			this.scaleY = this.height / this.originalHeight;
	}

	get width() {
		return parseFloat(this.css2('width')) || 0;
	}

	set width(width) {
		this._avatar.width = width;
		if (!this.originalWidth)
			this.originalWidth = width;
		else
			this.scaleX = this.width / this.originalWidth;
	}

	set text(text) {
		this._avatar.text = text;
		if (typeof this.element.textContent === 'string') {
			this.element.textContent = this.text;
		} else {
			this.element.innerText = this.text;
		}
	}
	get text() {
		return this._avatar.text;
	}

	set htmlText(htmlText) {
		this._avatar.text = htmlText;
		this.element.innerHTML = this.htmlText;
	}
	get htmlText() {
		return this._avatar.text;
	}

	set align(align) {
		this._avatar.align = align;
		this.css2('textAlign', this.align);
	}
	get align() {
		return this._avatar.align;
	}

	set color(color) {
		this._avatar.color = color;
		this.css2('color', this.color);
	}
	get color() {
		return this._avatar.color;
	}

	set size(size) {
		this._avatar.size = size;
		this.css2('fontSize', this.size + 'px');
	}
	get size() {
		return this._avatar.size;
	}

	set font(font) {
		this._avatar.font = font;
		this.css2('fontFamily', this.font);
	}
	get font() {
		return this._avatar.font;
	}

	set weight(weight) {
		this._avatar.weight = weight;
		this.css2('fontWeight', this.weight);
	}
	get weight() {
		return this._avatar.weight;
	}

	set smooth(smooth) {
		if (smooth)
			this.css3('fontSmoothing', 'antialiased !important');
		else
			this.css3('fontSmoothing', null);
	}

	toString() {
		return 'Text';
	}
}