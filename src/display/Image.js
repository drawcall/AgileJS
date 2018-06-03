import DisplayObject from './DisplayObject';
import LoadManager from '../utils/LoadManager';
import Agile from '../core/Agile';

export default class AgileImage extends DisplayObject {

	constructor(image, width, height) {
		super();

		this.x = 0;
		this.y = 0;
		this.delayEventTime = 5;

		if (image) {
			if (typeof image === 'string') {
				const reg = new RegExp('ftp|http|png|jpg|jpeg|gif');
				if (reg.test(image))
					this.image = image;
				else
					this.setClassImage(image);
			} else {
				this.image = image;
			}
		}

		if (width) this.width = width;
		if (height) this.height = height;
	}

	setClassImage(className) {
		this.addClass(className);
		this.dispatchImageLoadedEvent(() => {
			this.width = parseFloat(this.css2('width')) || 0;
			this.height = parseFloat(this.css2('height')) || 0;
			this._avatar.backgroundImage = this.css2('backgroundImage');
		});
	}

	get originalWidth() {
		return this._avatar.originalWidth;
	}

	set originalWidth(originalWidth) {
		this._avatar.originalWidth = originalWidth;
		this.css2('width', this.originalWidth + 'px');
		this.widthSize = true;
	}

	get originalHeight() {
		return this._avatar.originalHeight;
	}

	set originalHeight(originalHeight) {
		this._avatar.originalHeight = originalHeight;
		this.css2('height', this.originalHeight + 'px');
		this.widthSize = true;
	}

	get image() {
		return this._avatar.image;
	}

	set image(image) {
		this.loaded = false;
		this._avatar.image = LoadManager.getImage(image, (imgObj) => {
			if (!this.widthSize) {
				this._avatar.width = imgObj.width;
				this._avatar.originalWidth = imgObj.width;
				this.css2('width', imgObj.width + 'px');
			}

			if (!this.heightSize) {
				this._avatar.height = imgObj.height;
				this._avatar.originalHeight = imgObj.height;
				this.css2('height', imgObj.height + 'px');
			}

			this.backgroundImage = imgObj.src;
			this.transform();
			this.dispatchImageLoadedEvent();
		});
	}

	dispatchImageLoadedEvent(fun) {
		setTimeout(() => {
			if (fun) fun();

			let customEvent;
			try {
				customEvent = document.createEvent('CustomEvent');
				customEvent.initCustomEvent(Agile.IMAGE_LOADED, false, false);
				this.element.dispatchEvent(customEvent);
			} catch (e) {
				customEvent = document.createEvent('HTMLEvents');
				customEvent.initEvent(Agile.IMAGE_LOADED, false, false);
				this.element.dispatchEvent(customEvent);
			}

			this.loaded = true;
		}, this.delayEventTime);
	}

	toString() {
		return 'AgileImage';
	}
}