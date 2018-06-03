import DisplayObject from './DisplayObject';
import Css from '../core/Css';
import IDUtils from '../utils/IDUtils';

export default class Dom extends DisplayObject {

	constructor(dom, resetPosition) {
		super();
		if (dom === '3d' || dom === '2d') return;

		if (typeof dom === 'string')
			this.element = Css.select(dom);
		else if (dom['jquery'])
			this.element = dom[0];
		else
			this.element = dom;

		const id = Css.attr(this.element, 'id');
		this._avatar.id = id ? id : IDUtils.generateID(this.toString());

		this._avatar.width = parseFloat(this.css2('width')) || 0;
		this._avatar.height = parseFloat(this.css2('height')) || 0;
		this._avatar.position = this.css2('position') || 'absolute';
		this._avatar.zIndex = this.css2('zIndex') || 0;
		this._avatar.display = this.css2('display') || 'block';
		this._avatar.color = this.css2('backgroundColor');
		this._avatar.backgroundImage = this.css2('backgroundImage');
		this._avatar.alpha = this.css2('opacity') === '' || this.css2('opacity') === undefined ? 1 : this.css2('opacity');

		if (this._avatar.display !== 'none') this._avatar.defalutDisplay = this._avatar.display;

		this.transform();

		Agile.agileObjs[this.id] = this;
		if (resetPosition) this.resetPosition();
	}

	createElement() {
		// null
	}

	resetPosition() {
		this.originalWidth = this.width;
		this.originalHeight = this.height;
	}

	get visible() {
		return this._avatar.visible;
	}

	set visible(visible) {
		this._avatar.visible = visible;
		const defalutDisplay = this._avatar.defalutDisplay ? this._avatar.defalutDisplay : 'block';
		const vis = visible ? defalutDisplay : 'none';
		this.css2('display', vis);
	}

	toString() {
		return 'Dom';
	}
}