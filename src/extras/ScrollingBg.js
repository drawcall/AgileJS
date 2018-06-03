import Image from '../display/Image';
import Ease from '../animate/ease';
import Keyframes from '../animate/Keyframes';

export default class ScrollingBg extends Image {

	constructor(image, width, height, speed = 10, direction = 'left', backgroundWidth = 0, backgroundHeight = 0) {
		super(image, width, height);

		this.widthSize = true;
		this.heightSize = true;

		this.speed = speed;
		this.direction = direction;

		// fix background-position-y bug
		this.backgroundWidth = backgroundWidth;
		this.backgroundHeight = backgroundHeight;
		this.originalHeight = height;
		this.originalWidth = width;

		this.scrolling();
	}

	get backgroundWidth() {
		return this._avatar.backgroundWidth;
	}

	set backgroundWidth(backgroundWidth) {
		this._avatar.backgroundWidth = backgroundWidth;
		this.scrolling();
	}

	get backgroundHeight() {
		return this._avatar.backgroundHeight;
	}

	set backgroundHeight(backgroundHeight) {
		this._avatar.backgroundHeight = backgroundHeight;
		this.scrolling();
	}

	get speed() {
		return this._avatar.speed;
	}

	set speed(speed) {
		this._avatar.speed = speed;
		this.scrolling();
	}

	get direction() {
		return this._avatar.direction;
	}

	set direction(direction) {
		this._avatar.direction = direction;
		this.scrolling();
	}

	scrolling(speed, ease) {
		speed = speed || this.speed;
		ease = ease || Ease.linear;

		if (this.scrollframes) {
			this.removeFrame(this.scrollframes);
			this.scrollframes.destroy();
		}

		this.scrollframes = new Keyframes();
		this.scrollframes.add(0, {
			'background-position': '0% 0%'
		});

		if (this.direction === 'left') {
			const h = this.backgroundWidth ? 1 * this.backgroundWidth + 'px' : '200%';
			this.scrollframes.add(100, {
				'background-position': h + ' 0%'
			});
		} else if (this.direction === 'right') {
			const h = this.backgroundWidth ? -1 * this.backgroundWidth + 'px' : '-200%';
			this.scrollframes.add(100, {
				'background-position': h + ' 0%'
			});
		} else if (this.direction === 'up') {
			const h = this.backgroundHeight ? -1 * this.backgroundHeight + 'px' : '0%';
			this.scrollframes.add(100, {
				'background-position': '0% ' + h
			});
		} else if (this.direction === 'down' || this.direction === 'bottom') {
			const h = this.backgroundHeight ? 1 * this.backgroundHeight + 'px' : '0%';
			this.scrollframes.add(100, {
				'background-position': '0% ' + h
			});
		}

		this.addFrame(speed, this.scrollframes, {
			loop: -1,
			ease
		});
	}

	toString() {
		return 'ScrollingBg';
	}
}