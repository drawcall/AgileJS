import Agile from '../core/Agile';
import Css from '../core/Css';
import Text from '../display/Text';
import Utils from '../utils/Utils';
import JsonUtils from '../utils/JsonUtils';

export default {
	keyword: ['ease', 'delay', 'yoyo', 'all', 'loop', 'repeat', 'frame', 'onStart', 'onUpdate', 'onComplete', 'onCompleteParams', 'overwrite', 'setTimeout'],
	callbacks: {},
	arguments: {},
	oldAttribute: {},
	setTimeout: true,
	timeoutDelay: 30,
	index: 0,

	to(agile, duration, paramsObj) {
		const propertys = paramsObj['all'] ? ['all'] : this.apply(agile, paramsObj, this.index);
		let transition = '';

		for (let i = 0; i < propertys.length; i++) {
			if (i > 0) transition += ', ';

			transition += propertys[i];
			transition += ' ' + duration + 's';

			if (paramsObj['ease']) transition += ' ' + paramsObj['ease'];
			if (paramsObj['delay']) transition += ' ' + paramsObj['delay'] + 's';
		}

		let id = -999;
		if (this.useSetTimeout()) {
			id = setTimeout((agile, transition, paramsObj, tweenIndex) => {
				this.start(agile, transition, paramsObj, tweenIndex);
				id = -999;
			}, this.timeoutDelay, agile, transition, paramsObj, this.index);
		} else {
			this.start(agile, transition, paramsObj, this.index);
		}

		this.arguments[this.index + ''] = [agile, duration, paramsObj, id];
		return this.index++;
	},

	useSetTimeout() {
		let use = false;
		if (this.setTimeout !== undefined) {
			use = this.setTimeout;
		} else {
			if (Utils.browser().isFirefox || Utils.browser().isIE) {
				use = true;
			} else {
				use = false;
			}
		}

		return use;
	},

	start(agile, transition, paramsObj, tweenIndex) {
		if (paramsObj['overwrite']) {
			this.killTweensOf(agile);
			Utils.destroyObject(agile.transitions);
			agile.transitions[`${tweenIndex}`] = transition;
		} else {
			const preTransition = Utils.isEmpty(agile.transitions) || JsonUtils.object2String(agile.transitions) === 'none' ? '' : Css.css3(agile.element, 'transition') + ', ';
			agile.transitions[`${tweenIndex}`] = transition;
			transition = preTransition + transition;
		}

		Css.css3(agile.element, 'transition', transition);
		this.set(agile, paramsObj);

		this.addCallback(agile);

		if (paramsObj['onStart']) {
			const delay = paramsObj['delay'] || 0;
			setTimeout(paramsObj['onStart'], delay * 1000);
		}

		if (paramsObj['onComplete']) {
			if (paramsObj['onCompleteParams'])
				this.callbacks[agile.id].completes[`${tweenIndex}`] = [paramsObj['onComplete'], paramsObj['onCompleteParams']];
			else
				this.callbacks[agile.id].completes[`${tweenIndex}`] = [paramsObj['onComplete']];
		}
	},

	from(agile, duration, paramsObj) {
		let toObj = {};

		for (let index in paramsObj) {
			let newIndex = `_${index}_`;
			let i = this.getKeywordString().search(new RegExp(newIndex, 'i'));

			if (i === -1) {
				toObj[index] = agile[index];
				agile[index] = paramsObj[index];
			} else {
				toObj[index] = paramsObj[index];
			}
		}

		return this.to(agile, duration, toObj);
	},

	fromTo(agile, duration, fromObj, toObj) {
		for (let index in fromObj) {
			let newIndex = `_${index}_`;
			let i = this.getKeywordString().search(new RegExp(newIndex, 'i'));
			if (i === -1) agile[index] = fromObj[index];
		}

		return this.to(agile, duration, toObj);
	},

	apply(agile, paramsObj, tweenIndex) {
		const propertys = [];

		for (let index in paramsObj) {
			let newIndex = `_${index}_`;
			let i = this.getKeywordString().search(new RegExp(newIndex, 'i'));

			if (i <= -1) {
				this.getOldAttribute(agile, tweenIndex)[index] = agile[index];

				if (index === 'alpha')
					index = 'opacity';
				else if (index === 'color' && !(agile instanceof Text))
					index = 'background-color';
				else if (index === 'x' || index === 'y' || index === 'z')
					index = Agile.transform;
				else if (index === 'scaleX' || index === 'scaleY' || index === 'scaleZ')
					index = Agile.transform;
				else if (index === 'rotationX' || index === 'rotation' || index === 'rotationY' || index === 'rotationZ')
					index = Agile.transform;
				else if (index === 'skewX' || index === 'skewY')
					index = Agile.transform;
				else if (index === 'regX' || index === 'regY')
					index = this.Agile.transformOrigin;
				else if (index === 'width' || index === 'height')
					index = Agile.transform;
				else if (index === 'originalWidth')
					index = 'width';
				else if (index === 'originalHeight')
					index = 'height';

				if (propertys.indexOf(index) < 0) propertys.push(index);
			}
		}

		return propertys;
	},

	killTweensOf(agile, complete) {
		if (Utils.isNumber(agile)) {
			if (this.arguments[`${agile}`]) {
				const newagile = this.arguments[`${agile}`][0];
				const param = this.arguments[`${agile}`][2];
				let id = this.arguments[`${agile}`][3];
				if (id > 0) {
					clearTimeout(id);
					id = -999;
				}

				if (complete) this.set(newagile, param);
				Css.css3(newagile.element, 'transition', 'none !important');
				Css.css3(newagile.element, 'transition', 'none');

				this.removeCallback(newagile);
				delete this.arguments[`${agile}`];
				delete newagile.transitions[`${agile}`];
			}
		} else {
			for (let tweenIndex in this.arguments) {
				let arr = this.arguments[tweenIndex];

				if (arr[0] === agile) {
					let id = arr[3];
					if (id > 0) {
						clearTimeout(id);
						id = -999;
					}

					delete this.arguments[tweenIndex];
				}
			}

			if (complete) {
				if (this.oldAttribute[agile.id]) {
					for (let tweenIndex in this.oldAttribute[agile.id]) {
						for (let p in this.oldAttribute[agile.id][tweenIndex]) {
							agile[p] = this.oldAttribute[agile.id][tweenIndex][p];
						}

						delete this.oldAttribute[agile.id][tweenIndex];
					}
				}
			}

			Utils.destroyObject(agile.transitions);
			delete this.oldAttribute[agile.id];
			this.removeCallback(agile);

			Css.css3(agile.element, 'transition', 'none !important');
			Css.css3(agile.element, 'transition', 'none');
		}
	},

	killAll(complete) {
		for (let agileID in this.oldAttribute) {
			const agile = Agile.getEleById(agileID);
			this.killTweensOf(agile, complete);
		}
	},

	set(agile, paramsObj) {
		agile.css3('transition');

		for (let index in paramsObj) {
			let newIndex = `_${index}_`;
			let i = this.getKeywordString().search(new RegExp(newIndex, 'i'));

			if (i <= -1) {
				let j = Agile.keyword.search(new RegExp(newIndex, 'i'));
				if (j <= -1) {
					if (index.indexOf('-') > -1) {
						let arr = index.split('-');
						for (let i = 0; i < arr.length; i++) {
							if (i !== 0) arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
						}

						agile.css2(arr.join(''), paramsObj[index]);
					} else {
						agile.css2(index, paramsObj[index]);
					}
				} else {
					agile[index] = paramsObj[index];
				}
			}
		}
	},

	remove(agile, tweenIndex) {
		delete agile.transitions[`${tweenIndex}`];
		const transitions = JsonUtils.object2String(agile.transitions);
		Css.css3(agile.element, 'transition', transitions);
	},

	getKeywordString() {
		if (!this.keywordString) this.keywordString = '_' + this.keyword.join('_') + '_';
		return this.keywordString;
	},

	addCallback(agile) {
		if (this.callbacks[agile.id]) return this.callbacks[agile.id];

		this.callbacks[agile.id] = {
			fun: e => {
				const callback = this.callbacks[agile.id];
				for (let index in agile.transitions) {
					if (agile.transitions[index].indexOf(e.propertyName) > -1) {
						this.remove(agile, index);
						this.deleteOldAttribute(agile, index);

						if (callback.completes[index]) {
							const completes = callback.completes[index];
							if (completes.length === 1)
								completes[0].apply(agile);
							else
								completes[0].apply(agile, completes[1]);

							try {
								delete callback.completes[index];
							} catch (e) {
								//
							}
						}
					}
				}
			},
			completes: {}
		}

		this.getPrefixEvent();
		agile.element.addEventListener(this.transitionend, this.callbacks[agile.id].fun, false);

		return this.callbacks[agile.id];
	},

	removeCallback(agile) {
		if (this.callbacks[agile.id]) {
			const callback = this.callbacks[agile.id];
			this.getPrefixEvent();
			agile.element.removeEventListener(this.transitionend, callback.fun, false);

			if (callback.completes) Utils.destroyObject(callback.completes);
			Utils.destroyObject(callback);

			delete this.callbacks[agile.id];
		}
	},

	getPrefixEvent() {
		if (!this.transitionend) {
			const prefix = Css.getPrefix();
			switch (prefix) {
				case 'Webkit':
					this.transitionend = 'webkitTransitionEnd';
					break;
				case 'ms':
					this.transitionend = 'MSTransitionEnd';
					break;
				case 'O':
					this.transitionend = 'oTransitionEnd';
					break;
				case 'Moz':
					this.transitionend = 'transitionend';
					break;
				default:
					this.transitionend = 'transitionend';
			}
		}
	},

	getOldAttribute(agile, tweenIndex) {
		if (!this.oldAttribute[agile.id]) this.oldAttribute[agile.id] = {};
		if (!this.oldAttribute[agile.id][tweenIndex]) this.oldAttribute[agile.id][tweenIndex] = {};

		return this.oldAttribute[agile.id][tweenIndex];
	},

	deleteOldAttribute(agile, tweenIndex) {
		if (this.oldAttribute[agile.id]) {
			delete this.oldAttribute[agile.id][tweenIndex];

			if (Utils.isEmpty(this.oldAttribute[agile.id])) delete this.oldAttribute[agile.id];
		}
	}
}