(function(Agile, undefined) {
	var Tween = Agile.Tween || {
		'keyword' : ['ease', 'delay', 'yoyo', 'all', 'loop', 'repeat', 'frame', 'onStart', 'onUpdate', 'onComplete', 'onCompleteParams', 'overwrite', 'setTimeout'],
		callbacks : {},
		arguments : {},
		oldAttribute : {},
		//To fix css3 transform bugs using setTimeout., But doing so will lose a lot of efficiency。
		setTimeout : true,
		timeoutDelay : 30,
		index : 0
	}

	Tween.to = function(agile, duration, paramsObj) {
		var propertys = paramsObj['all'] ? ['all'] : Tween.apply(agile, paramsObj, Tween.index);
		var transition = '';

		for (var i = 0; i < propertys.length; i++) {
			if (i > 0)
				transition += ', ';
			transition += propertys[i];
			transition += ' ' + duration + 's';
			if (paramsObj['ease'])
				transition += ' ' + paramsObj['ease'];
			if (paramsObj['delay'])
				transition += ' ' + paramsObj['delay'] + 's';
		}

		var id = -999;
		var isSetTimeout = false;
		isSetTimeout = paramsObj.setTimeout === undefined ? Tween.setTimeout : paramsObj.setTimeout;
		
		if (isSetTimeout) {
			id = setTimeout(function(agile, transition, paramsObj, tweenIndex) {
				Tween.start(agile, transition, paramsObj, tweenIndex);
				id = -999;
			}, Tween.timeoutDelay, agile, transition, paramsObj, Tween.index);
		} else {
			Tween.start(agile, transition, paramsObj, Tween.index);
		}

		Tween.arguments[Tween.index + ''] = [agile, duration, paramsObj, id];
		return Tween.index++;
	}

	Tween.start = function(agile, transition, paramsObj, tweenIndex) {
		if (paramsObj['overwrite']) {
			Tween.killTweensOf(agile);
			Agile.Utils.destroyObject(agile.transitions);
			agile.transitions[tweenIndex + ''] = transition;
		} else {
			var preTransition = Agile.Utils.isEmpty(agile.transitions) || Agile.JsonUtils.object2String(agile.transitions) == 'none' ? '' : Agile.Css.css3(agile.element, 'transition') + ', ';
			agile.transitions[tweenIndex + ''] = transition;
			transition = preTransition + transition;
		}

		Agile.Css.css3(agile.element, 'transition', transition);
		Tween.set(agile, paramsObj);

		Tween.addCallback(agile);
		if (paramsObj['onStart']) {
			var delay = paramsObj['delay'] || 0;
			setTimeout(paramsObj['onStart'], delay * 1000);
		}

		if (paramsObj['onComplete']) {
			if (paramsObj['onCompleteParams'])
				Tween.callbacks[agile.id].completes[tweenIndex + ''] = [paramsObj['onComplete'], paramsObj['onCompleteParams']];
			else
				Tween.callbacks[agile.id].completes[tweenIndex + ''] = [paramsObj['onComplete']];
		}
	}

	Tween.from = function(agile, duration, paramsObj) {
		var toObj = {};
		for (var index in paramsObj) {
			var newIndex = '_' + index + '_';
			var i = Tween.getKeywordString().search(new RegExp(newIndex, 'i'));
			if (i == -1) {
				toObj[index] = agile[index];
				agile[index] = paramsObj[index];
			} else {
				toObj[index] = paramsObj[index];
			}
		}

		return Tween.to(agile, duration, toObj);
	}

	Tween.fromTo = function(agile, duration, fromObj, toObj) {
		for (var index in fromObj) {
			var newIndex = '_' + index + '_';
			var i = Tween.getKeywordString().search(new RegExp(newIndex, 'i'));
			if (i == -1)
				agile[index] = fromObj[index];
		}

		return Tween.to(agile, duration, toObj);
	}

	Tween.apply = function(agile, paramsObj, tweenIndex) {
		var propertys = [];
		for (var index in paramsObj) {
			var newIndex = '_' + index + '_';
			var i = Tween.getKeywordString().search(new RegExp(newIndex, 'i'));
			if (i <= -1) {
				Tween.getOldAttribute(agile,tweenIndex)[index] = agile[index];

				if (index == 'alpha')
					index = 'opacity';
				else if (index == 'color' && !( agile instanceof Agile.Text))
					index = 'background-color';
				else if (index == 'x' || index == 'y' || index == 'z')
					index = Agile.transform;
				else if (index == 'scaleX' || index == 'scaleY' || index == 'scaleZ')
					index = Agile.transform;
				else if (index == 'rotationX' || index == 'rotation' || index == 'rotationY' || index == 'rotationZ')
					index = Agile.transform;
				else if (index == 'skewX' || index == 'skewY')
					index = Agile.transform;
				else if (index == 'regX' || index == 'regY')
					index = Tween.Agile.transformOrigin;
				else if (index == 'width' || index == 'height')
					index = Agile.transform;
				else if (index == 'originalWidth')
					index = 'width';
				else if (index == 'originalHeight')
					index = 'height';

				if (propertys.indexOf(index) < 0)
					propertys.push(index);
			}
		}

		return propertys;
	}

	Tween.killTweensOf = function(agile, complete) {
		if (Agile.Utils.isNumber(agile)) {
			if (Tween.arguments[agile + '']) {
				var newagile = Tween.arguments[agile+''][0];
				var param = Tween.arguments[agile+''][2];
				var id = Tween.arguments[agile+''][3];
				if (id > 0) {
					clearTimeout(id);
					id = -999;
				}
				if (complete)
					Tween.set(newagile, param);

				Agile.Css.css3(newagile.element, 'transition', 'none !important');
				Agile.Css.css3(newagile.element, 'transition', 'none');
				Tween.removeCallback(newagile);
				delete Tween.arguments[agile + ''];
				delete newagile.transitions[agile + ''];
			}
		} else {
			for (var tweenIndex in Tween.arguments) {
				var arr = Tween.arguments[tweenIndex];
				if (arr[0] == agile) {
					var id = arr[3];
					if (id > 0) {
						clearTimeout(id);
						id = -999;
					}
					
					delete Tween.arguments[tweenIndex];
				}
			}
			
			if (complete) {
				if (Tween.oldAttribute[agile.id]) {
					for (var tweenIndex in Tween.oldAttribute[agile.id]) {
						for (var p in Tween.oldAttribute[agile.id][tweenIndex]) {
							agile[p] = Tween.oldAttribute[agile.id][tweenIndex][p];
						}
						delete Tween.oldAttribute[agile.id][tweenIndex];
					}
				}
			}
			
			Agile.Utils.destroyObject(agile.transitions);
			delete Tween.oldAttribute[agile.id];
			Tween.removeCallback(agile);
			Agile.Css.css3(agile.element, 'transition', 'none !important');
			Agile.Css.css3(agile.element, 'transition', 'none');
		}
	}

	Tween.killAll = function(complete) {
		for (var agileID in Tween.oldAttribute) {
			var agile = Agile.getAgileByID(agileID);
			Tween.killTweensOf(agile, complete);
		}
	}

	Tween.set = function(agile, paramsObj) {
		agile.css3('transition');
		for (var index in paramsObj) {
			var newIndex = '_' + index + '_';
			var i = Tween.getKeywordString().search(new RegExp(newIndex, 'i'));
			if (i <= -1) {
				var j = Agile.keyword.search(new RegExp(newIndex, 'i'));
				if (j <= -1) {
					if (index.indexOf('-') > -1) {
						var arr = index.split('-');
						for (var i = 0; i < arr.length; i++) {
							if (i != 0)
								arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
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
	}

	Tween.remove = function(agile, tweenIndex) {
		tweenIndex = tweenIndex + '';
		delete agile.transitions[tweenIndex];
		var transitions = Agile.JsonUtils.object2String(agile.transitions);
		Agile.Css.css3(agile.element, 'transition', transitions);
	}

	Tween.getKeywordString = function() {
		if (!Tween.keywordString)
			Tween.keywordString = '_' + Tween.keyword.join('_') + '_';
		return Tween.keywordString;
	}

	Tween.addCallback = function(agile) {
		if (!Tween.callbacks[agile.id]) {
			Tween.callbacks[agile.id] = {
				fun : function(e) {
					for (var tweenIndex in agile.transitions) {
						if (agile.transitions[tweenIndex].indexOf(e.propertyName) > -1) {
							Tween.remove(agile, tweenIndex);
							Tween.deleteOldAttribute(agile, tweenIndex);

							if (Tween.callbacks[agile.id].completes[tweenIndex]) {
								if (Tween.callbacks[agile.id].completes[tweenIndex].length == 1)
									Tween.callbacks[agile.id].completes[tweenIndex][0].apply(agile);
								else
									Tween.callbacks[agile.id].completes[tweenIndex][0].apply(agile, Tween.callbacks[agile.id].completes[tweenIndex][1]);

								try {
									delete Tween.callbacks[agile.id].completes[tweenIndex];
								} catch(e) {
									//
								}
							}
						}
					}
				},
				completes : {}
			}

			Tween.prefixEvent();
			agile.element.addEventListener(Tween.transitionend, Tween.callbacks[agile.id].fun, false);
		}

		return Tween.callbacks[agile.id];
	}

	Tween.removeCallback = function(agile) {
		if (Tween.callbacks[agile.id]) {
			Tween.prefixEvent();
			agile.element.removeEventListener(Tween.transitionend, Tween.callbacks[agile.id].fun, false);
			if(Tween.callbacks[agile.id].completes)
				Agile.Utils.destroyObject(Tween.callbacks[agile.id].completes);
			Agile.Utils.destroyObject(Tween.callbacks[agile.id]);
			
			delete Tween.callbacks[agile.id];
		}
	}

	Tween.prefixEvent = function() {
		if (!Tween.transitionend) {
			var prefix = Agile.Css.getPrefix();
			switch(prefix) {
				case 'Webkit':
					Tween.transitionend = 'webkitTransitionEnd';
					break;
				case 'ms':
					Tween.transitionend = 'MSTransitionEnd';
					break;
				case 'O':
					Tween.transitionend = 'oTransitionEnd';
					break;
				case 'Moz':
					Tween.transitionend = 'transitionend';
					break;
				default:
					Tween.transitionend = 'transitionend';
			}
		}
	}

	Tween.getOldAttribute = function(agile, tweenIndex) {
		if (!Tween.oldAttribute[agile.id])
			Tween.oldAttribute[agile.id] = {};
		if (!Tween.oldAttribute[agile.id][tweenIndex])
			Tween.oldAttribute[agile.id][tweenIndex] = {};
		return Tween.oldAttribute[agile.id][tweenIndex];
	}

	Tween.deleteOldAttribute = function(agile, tweenIndex) {
		if (Tween.oldAttribute[agile.id]) {
			delete Tween.oldAttribute[agile.id][tweenIndex];
			if (Agile.Utils.isEmpty(Tween.oldAttribute[agile.id]))
				delete Tween.oldAttribute[agile.id];
		}
	}

	Agile.Tween = Tween;
})(Agile);
