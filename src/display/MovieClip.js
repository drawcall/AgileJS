import Image from './Image';
import Utils from '../utils/Utils';
import JsonUtils from '../utils/JsonUtils';
import Keyframes from '../animate/Keyframes';
import Timeline from '../animate/Timeline';

export default class MovieClip extends Image {

	constructor(image, width, height, labels, speed) {
		super(image, width, height);

		this.widthSize = true;
		this.heightSize = true;

		this._avatar.originalHeight = height;
		this._avatar.originalWidth = width;

		this._avatar.currentFrame = 1;
		if (labels) this.setLabel(labels);

		this.labels = {};
		this.speed = speed || .6;
		this.loop = true;

		this.stop();
	}

	get currentFrame() {
		// sorry this have a lot of bugs i am fixing
		const props = this.labels[this.label];
		const totalframes = props['totalframes'];
		const w = props['width'];
		const h = props['height'];
		let length;

		if (h === 0) {
			length = Utils.getCssValue(this, 'backgroundPosition', 0, 2);
			this._avatar.currentFrame = length * totalframes / w;
		} else {
			length = Utils.getCssValue(this, 'backgroundPosition', 1, 2);
			this._avatar.currentFrame = length * totalframes / h;
		}

		return this._avatar.currentFrame;
	}

	get label() {
		return this._avatar.label;
	}

	set label(label) {
		if (this.labels[label]) {
			this._avatar.label = label;
			const frame = this.labels[label]['frame'];
			const totalframes = this.labels[label]['totalframes'];

			if (Timeline.indexOf(frame) <= -1) Timeline.insertKeyframes(this, frame);

			const loop = this.loop ? -1 : 0;

			Timeline.removeFrameByIndex(this, this.currentTimelineIndex);
			this.currentTimelineIndex = Timeline.playFrame(this, this.speed, frame, {
				loop: loop,
				ease: `steps(${totalframes})`
			});

			this.totalframes = totalframes;
			this.play();
		}
	}

	get speed() {
		return this._avatar.speed;
	}

	set speed(speed) {
		this._avatar.speed = speed;

		if (this.labels[this.label]) {
			Timeline.removeFrameByIndex(this, this.currentTimelineIndex);

			const loop = this.loop ? -1 : 0;
			const frame = this.labels[this.label]['frame'];
			const totalframes = this.labels[this.label]['totalframes'];
			Timeline.removeFrameByIndex(this, this.currentTimelineIndex);

			this.currentTimelineIndex = Timeline.playFrame(this, this.speed, frame, {
				loop,
				ease: `steps(${totalframes})`
			});
		}

		this.play();
	}

	stop() {
		this.playing = false;
		this.pause();
	}

	play(label) {
		if (this.recordLabel) {
			this.animations[this.recordLabel.index] = this.recordLabel.frame;
			const animation = JsonUtils.object2String(this.animations);
			this.css3('animation', animation);
		}

		this.playing = true;
		this.resume();
	}

	gotoAndPlay(frameNumber) {
		if (typeof frameNumber === 'string') {
			this.label = frameNumber;
		} else {
			frameNumber--;

			const props = this.labels[this.label];
			const to = props['to'];
			const totalframes = props['totalframes'];
			const w = props['width'];
			const h = props['height'];

			let length;
			let position;

			if (h === 0) {
				length = w * frameNumber / totalframes;
				position = -length + 'px ' + -to.y + 'px';
			} else {
				length = h * frameNumber / totalframes;
				position = -to.x + 'px ' + -length + 'px';
			}

			this.css2('backgroundPosition', position);
			const animation = JsonUtils.object2String(this.animations);
			this.css3('animation', animation);

			this.play();
		}
	}

	gotoAndStop(frameNumber) {
		if (typeof frameNumber === 'string') {
			this.label = frameNumber;
		} else {
			frameNumber--;

			const props = this.labels[this.label];
			const to = props['to'];
			const totalframes = props['totalframes'];
			const w = props['width'];
			const h = props['height'];

			let length;
			let position;

			if (h === 0) {
				length = w * frameNumber / totalframes;
				position = -length + 'px ' + -to.y + 'px';
			} else {
				length = h * frameNumber / totalframes;
				position = -to.x + 'px ' + -length + 'px';
			}

			this.css2('backgroundPosition', position);
			const frame = Timeline.removeFrameByIndex(this, this.currentTimelineIndex);

			this.recordLabel = {
				frame,
				index: this.currentTimelineIndex
			};
		}
	}

	setLabel(label, from, to, totalframes) {
		if (typeof label === 'object') {
			let frome;
			let to;
			let frame;
			let l;

			if (label['from'] && label['to']) {
				frome = label['from'];
				to = label['to'];
				l = label['label'];
				frame = label['totalframes'];

				return this.setLabel(l, frome, to, frame);
			} else {
				for (let l in label) {
					frome = label[l]['from'];
					to = label[l]['to'];
					frame = label[l]['totalframes'];

					return this.setLabel(l, frome, to, frame);
				}
			}
		} else {
			this.labels[label] = this.makeFrame(from, to, totalframes);
			this.label = label;
		}

		return this.labels[label];
	}

	makeFrame(from, to, totalframes) {
		from = from || { x: '0px', y: '0px' };
		to = to || { x: '-200%', y: '0px' };

		const width = Math.abs(parseFloat(to.x - from.x));
		const height = Math.abs(parseFloat(to.y - from.y));
		const frame = new Keyframes();

		const fromX = -from.x;
		const fromY = -from.y;
		const toX = -to.x;
		const toY = -to.y;

		frame.add(0, { 'background-position': fromX + 'px ' + fromY + 'px' });
		frame.add(100, { 'background-position': toX + 'px ' + toY + 'px' });

		return {
			frame, totalframes, width, height, from, to
		};
	}

	toString() {
		return 'MovieClip';
	}
}