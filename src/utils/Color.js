import Utils from './Utils';

export default {

	gradient(type = 'linear', ...rest) {
		let color;

		if (type === 'linear' || type === 'line') {
			color = 'linear-gradient(';
			for (let i = 0, length = rest.length; i < length; i++) {
				if (i === 0 && Utils.isNumber(rest[i])) {
					color += this.getDirection(rest[i]);
				} else if (i === length - 1) {
					color += rest[i] + ')';
				} else {
					color += rest[i] + ',';
				}
			}

			return color;
		} else if (type === 'radial' || type === 'rad') {
			color = 'radial-gradient(';
			for (let i = 0, length = rest.length; i < length; i++) {
				if (i === length - 1)
					color += rest[i] + ')';
				else
					color += rest[i] + ',';
			}

			return color;
		}
	},

	getDirection(deg) {
		let dir;
		if (deg === 0) {
			dir = 'to bottom,'
		} else if (deg === 180) {
			dir = deg + 'to up,'
		} else if (deg === 90) {
			dir = deg + 'to right,'
		} else if (deg === 270) {
			dir = deg + 'to left,'
		} else {
			dir = deg + 'deg,'
		}

		return dir;
	},

	rgba(r, g, b, a) {
		a = Utils.initValue(a, 1);
		return 'rbga(' + r + ',' + g + ',' + b + ',' + a + ')';

	},

	hsl(h, s = 100, l = 100, a = 1) {
		return `hsl(${h}, ${s}%, ${l}%, a)`;
	},

	randomColor() {
		return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
	},

	alpha0: 'transparent'
}