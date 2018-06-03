import Utils from './Utils';

export default {
	object2Json(obj) {
		let t = typeof (obj);

		if (t !== 'object' || obj === null) {
			if (t === 'string') obj = '' + obj + '';
			return String(obj);
		} else {
			let n, v;
			const json = [];
			const isArr = Utils.isArray(obj);

			for (n in obj) {
				v = obj[n];
				t = typeof (v);
				if (t === 'string') {
					// v = ''' + v + ''';
				} else {
					if (t === 'object' && v !== null) {
						v = this.object2Json(v);
					}
				}

				json.push((isArr ? '' : '' + n + ':') + String(v));
			}
			let j = json.join('; ');

			return (isArr ? '[' : '{') + j + (isArr ? ']' : '}');
		}
	},

	object2String(obj) {
		let str = '';
		for (let index in obj)
			str += obj[index] + ', ';

		str = str.substr(0, str.length - 2);
		return str;
	},

	replaceChart(json) {
		return json
			.replace(new RegExp('%:', 'g'), '%')
			.replace(new RegExp('};', 'g'), '}');
	}
}