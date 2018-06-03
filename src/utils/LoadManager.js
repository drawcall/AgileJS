import EventDispatcher from '../event/EventDispatcher';
import Utils from './Utils';
import Agile from '../core/Agile';
import Css from '../core/Css';

const imageBuffer = {};

export default class LoadManager extends EventDispatcher {
	constructor() {
		super();

		this._urls = [];
		this._loaderList = [];
		this._targetList = {};
		this._fileSize = [];
		this._totalSize = 0;

		this.index = 0;
		this.loadIndex = 0;
		this.loaded = false;
		this.baseURL = '';
		this.parallel = 4;

		this.completeHandler = this.completeHandler.bind(this);
		this.ioErrorHandler = this.ioErrorHandler.bind(this);
	}

	ioErrorHandler(e) {
		this.loadIndex++;
		this._targetList.push(null);

		this.dispatchEvent({ type: Agile.LOAD_ERROR });
		this.checkLoaded();
		this.singleLoad();
	}

	completeHandler(e) {
		const num = Css.attr(e.target, 'data-index');
		const targetList = this._targetList;
		const loaderList = this._loaderList;
		const img = loaderList[num];

		for (let index in targetList) {
			if (Css.attr(img, 'data-url') === targetList[index]) targetList[index] = img;
		}

		this.loadIndex++;
		this.dispatchEvent({ type: Agile.SINGLE_LOADED });
		this.checkLoaded();
		this.singleLoad();
	}

	checkLoaded() {
		if (this.loadIndex >= this._urls.length && !this.loaded) {
			this.loaded = true;
			this.dispatchEvent({ type: Agile.GROUP_LOADED });
		}
	}

	static getImage(img, callback) {
		if (typeof img === 'string') {
			if (imageBuffer[img]) {
				callback(imageBuffer[img]);
			} else {
				const myImage = new Image();
				myImage.onload = e => {
					imageBuffer[img] = myImage;
					callback(imageBuffer[img]);
				}
				myImage.src = img;
			}

			return img;
		} else if (typeof img === 'object') {
			imageBuffer[img.src] = img;
			callback(imageBuffer[img.src]);

			return img.src;
		}
	}

	get loadScale() {
		return this.loadIndex / this._urls.length;
	}

	get targetList() {
		return this._targetList;
	}

	get loaderList() {
		return this._loaderList;
	}

	set fileSize(size) {
		this._fileSize = size;
		this._totalSize = 0;

		for (let i = 0; i < this._fileSize.length; i++) {
			this._totalSize += this._fileSize[i];
		}
	}

	load(...rest) {
		let index = 0;
		for (let i = 0; i < rest.length; i++) {
			let url = rest[i];

			if (typeof url === 'string') {
				this._targetList[`${index}`] = url;
				this._urls.push(url);

				index++;
			} else if (Utils.isArray(url)) {
				for (let j = 0; j < url.length; j++) {
					this._targetList[`${index}`] = url[j];
					this._urls.push(url[j]);

					index++;
				}
			} else {
				for (let index in url) {
					this._targetList[index] = url[index];
					this._urls.push(url[index]);
				}
			}
		}

		const length = Math.min(this.parallel, this._urls.length);
		for (let i = 0; i < length; i++) {
			this.singleLoad();
		}
	}

	singleLoad() {
		if (this.loaded) return;
		if (this.index >= this._urls.length) return;

		const url = String(this._urls[this.index]);
		const image = new Image();

		image.onerror = this.ioErrorHandler;
		image.onload = this.completeHandler;
		image.src = this.baseURL + url;
		Css.attr(image, 'data-url', url);
		Css.attr(image, 'data-index', this.index);

		this.index++;
		this._loaderList.push(image);
	}
}