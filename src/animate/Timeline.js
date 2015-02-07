(function(Agile, undefined) {
	var Timeline = Timeline || {
		index : 0,
		callbacks : {},
		currentTime : 0,
		nextTween : [],
		replace : false,
		remove : true,
		get avatar() {
            if (!this.avatarmc) this.avatarmc = new Agile.Avatar(1, 1);
            return this.avatarmc;
        }
	}

	/*
	 * Timeline.addFrame(mc,1.5,myKeyframe);
	 * Timeline.addFrame(mc,1.5,{frame:myKeyframe,delay:.5});
	 * Timeline.addFrame(mc,1.5,myKeyframe,{delay:.5,loop:12});
	 * Timeline.addFrame(mc,1.5,{delay:.5,loop:12},myKeyframe);
	 */
	Timeline.addFrame = function(agile, duration, frameObj, paramsObj) {
		if ( frameObj instanceof Agile.Keyframes) {
			if (!paramsObj)
				paramsObj = {}
			Timeline.insertKeyframes(agile, frameObj, paramsObj['replace']);
			Timeline.apply(agile, duration, frameObj, paramsObj);
		} else if ( typeof frameObj == 'object') {
			if (frameObj.hasOwnProperty('frame'))
				var keyframe = frameObj['frame'];
			else
				var keyframe = paramsObj;

			Timeline.insertKeyframes(agile, keyframe, frameObj['replace']);
			Timeline.apply(agile, duration, keyframe, frameObj);
		}
		
		return Timeline.index++;
	}

	Timeline.playFrame = function(agile, duration, frameObj, paramsObj) {
		if ( frameObj instanceof Agile.Keyframes) {
			if (!paramsObj)
				paramsObj = {}
			Timeline.apply(agile, duration, frameObj, paramsObj);
		} else if ( typeof frameObj == 'object') {
			if (frameObj.hasOwnProperty('frame'))
				var keyframe = frameObj['frame'];
			else
				var keyframe = paramsObj;

			Timeline.apply(agile, duration, keyframe, frameObj);
		}
		
		return Timeline.index++;
	}

	Timeline.insertKeyframes = function(agile, keyframes, replace) {
		if (replace || Timeline.replace)
			Timeline.removeKeyframes(agile.id + '_' + keyframes.label);

		var prefix = Agile.Css.getPrefix(2);
		Timeline.avatar.clearStyle();
		Timeline.avatar.copySelf(agile, 'all');
		var keys = {};
		for (var time in keyframes.keyframes) {
			var timeObj = keyframes.keyframes[time];
			keys[time] = {};

			for (var style in timeObj) {
				var newIndex = '_' + style + '_';
				var i = Agile.keyword.search(new RegExp(newIndex, 'i'));
				if (i <= -1) {
					if (style.indexOf('-') > -1) {
						var arr = style.split('-');
						for (var i = 0; i < arr.length; i++) {
							if (i != 0)
								arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
						}
						Timeline.avatar.css2(arr.join(''), timeObj[style]);
					} else {
						Timeline.avatar.css2(style, timeObj[style]);
					}
				} else {
					Timeline.avatar[style] = timeObj[style];
				}

				if (style == 'alpha') {
					keys[time]['opacity'] = Timeline.avatar[style];
				} else if (style == 'color' && !( agile instanceof Agile.Text)) {
					keys[time]['background-color'] = Timeline.avatar[style];
				} else if (style == 'x' || style == 'y' || style == 'z') {
					keys[time][prefix + 'transform'] = Timeline.avatar.css3('transform');
				} else if (style == 'scaleX' || style == 'scaleY' || style == 'scaleZ') {
					keys[time][prefix + 'transform'] = Timeline.avatar.css3('transform');
				} else if (style == 'rotationX' || style == 'rotationY' || style == 'rotationZ' || style == 'rotation') {
					keys[time][prefix + 'transform'] = Timeline.avatar.css3('transform');
				} else if (style == 'skewX' || style == 'skewY') {
					keys[time][prefix + 'transform'] = Timeline.avatar.css3('transform');
				} else if (style == 'width' || style == 'height') {
					keys[time][prefix + 'transform'] = Timeline.avatar.css3('transform');
				} else if (style == 'regX' || style == 'regY') {
					keys[time][prefix + 'transform-origin'] = Timeline.avatar.css3('transformOrigin');
				} else if (style == 'originalWidth') {
					keys[time]['width'] = Timeline.avatar.css2('width');
				} else if (style == 'originalHeight') {
					keys[time]['height'] = Timeline.avatar.css2('height');
				} else if(style == 'round') {
					keys[time]['border-radius'] = Timeline.avatar[style] + 'px';
				} else {
					keys[time][style] = Timeline.avatar.css2(style);
				}
			}
		}

		var keyframesTag = '@' + Agile.Css.getPrefix(2) + 'keyframes';
		var styles = Agile.Css.getDynamicSheet();
		var paramsObj = Agile.JsonUtils.object2Json(keys);
		paramsObj = Agile.JsonUtils.replaceChart(paramsObj);
		var css = keyframesTag + ' ' + agile.id + '_' + keyframes.label + paramsObj;
		styles.insertRule(css, styles.cssRules.length);
		styles = null;
	}

	Timeline.apply = function(agile, duration, keyframe, paramsObj) {
		var animation = '';
		var label = typeof keyframe == 'string' ? keyframe : keyframe.label;
		animation += agile.id + '_' + label + ' ';
		animation += duration + 's ';
		if (paramsObj['ease'])
			animation += paramsObj['ease'] + ' ';
		if (paramsObj['delay'])
			animation += paramsObj['delay'] + 's ';

		if (paramsObj['loop']) {
			if (paramsObj['loop'] <= 0)
				paramsObj['loop'] = 'infinite';
			animation += paramsObj['loop'] + ' ';
		} else if (paramsObj['repeat']) {
			if (paramsObj['repeat'] <= 0)
				paramsObj['repeat'] = 'infinite';
			animation += paramsObj['repeat'] + ' ';
		}
		if (paramsObj['yoyo']) {
			if (paramsObj['yoyo'] == true)
				paramsObj['yoyo'] = 'alternate';
			if (paramsObj['yoyo'] == false)
				paramsObj['yoyo'] = 'normal';
			animation += paramsObj['yoyo'] + ' ';
		}

		animation += 'forwards';

		var preTransition = Agile.Utils.isEmpty(agile.animations) ? '' : Agile.Css.css3(agile.element, 'animation') + ', ';
		agile.animations[Timeline.index + ''] = animation;
		animation = preTransition + animation;
		agile.css3('animation', animation);

		Timeline.addCallback(agile);
		Timeline.callbacks[agile.id].sets[Timeline.index + ''] = keyframe.merge();
		Timeline.callbacks[agile.id].removes[Timeline.index + ''] = (paramsObj['remove'] || Timeline.remove);
		if (paramsObj['onComplete']) {
			if (paramsObj['onCompleteParams'])
				Timeline.callbacks[agile.id].completes[Timeline.index + ''] = [paramsObj['onComplete'], paramsObj['onCompleteParams']];
			else
				Timeline.callbacks[agile.id].completes[Timeline.index + ''] = [paramsObj['onComplete']];
		}
	}

	Timeline.removeKeyframes = function(frame) {
		var name = typeof frame == 'string' ? frame : frame.label;
		var styles = Agile.Css.getDynamicSheet();
		var rules = styles.cssRules || styles.rules || [];
		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i];
			if (rule.type === CSSRule.KEYFRAMES_RULE || rule.type === CSSRule.MOZ_KEYFRAMES_RULE || rule.type === CSSRule.WEBKIT_KEYFRAMES_RULE || rule.type === CSSRule.O_KEYFRAMES_RULE || rule.type === CSSRule.MS_KEYFRAMES_RULE) {
				if (rule.name == name) {
					styles.deleteRule(i);
				}
			}
		}
	}

	Timeline.indexOf = function(keyName) {
		var name = typeof keyName == 'string' ? keyName : keyName.label;
		var styles = Agile.Css.getDynamicSheet();
		var rules = styles.cssRules || styles.rules || [];
		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i];
			if (rule.type === CSSRule.KEYFRAMES_RULE || rule.type === CSSRule.MOZ_KEYFRAMES_RULE || rule.type === CSSRule.WEBKIT_KEYFRAMES_RULE || rule.type === CSSRule.O_KEYFRAMES_RULE || rule.type === CSSRule.MS_KEYFRAMES_RULE) {
				if (rule.name == keyName) {
					return 100;
				}
			}
		}

		return -100;
	}

	Timeline.pause = function(agile) {
		Agile.Css.css3(agile.element, 'animationPlayState', 'paused');
	}

	Timeline.resume = function(agile) {
		Agile.Css.css3(agile.element, 'animationPlayState', 'running');
	}

	Timeline.toggle = function(agile) {
		if (Agile.Css.css3(agile.element, 'animationPlayState') == 'running')
			Timeline.pause(agile);
		else
			Timeline.resume(agile);
	}

	Timeline.removeFrameByIndex = function(agile, index) {
		index = index + '';
		var deleteItem = agile.animations[index];
		if (deleteItem) {
			agile.animations[index] = '0';
			var animation = Agile.JsonUtils.object2String(agile.animations);
			if (Agile.Utils.replace(animation, ['0,', '0', ' '], '') == '')
				Timeline.removeAllFrames(agile);
			else
				agile.css3('animation', animation);
		}
		return deleteItem;
	}

	Timeline.removeFrame = function(agile, frame, removeStyle) {
		if (Agile.Utils.isNumber(frame)) {
			var timelineIndex = frame;
			var keyframes = agile.animations[timelineIndex + ''];
		} else if ( typeof frame == 'string') {
			if (frame.indexOf(agile.id) > -1)
				var keyframes = frame;
			else
				var keyframes = agile.id + '_' + frame;
			var timelineIndex = Agile.Utils.objectforkey(agile.animations, keyframes);
		} else {
			var keyframes = agile.id + '_' + frame.label;
			var timelineIndex = Agile.Utils.objectforkey(agile.animations, keyframes);
		}
		if (removeStyle)
			Timeline.removeKeyframes(keyframes);
		return Timeline.removeFrameByIndex(agile, timelineIndex);
	}

	Timeline.removeFrameAfter = function(agile, frame, complete, removeStyle) {
		Timeline.prefixEvent();
		agile.element.addEventListener(Timeline.animationiteration, animationiterationHandler, false);
		function animationiterationHandler(e) {
			Timeline.removeFrame(agile, frame, removeStyle);
			agile.element.removeEventListener(Timeline.animationiteration, animationiterationHandler);
            if(complete)
                complete();
		}

	}

	Timeline.removeAllFrames = function(agile) {
		for (var index in agile.animations)
		delete agile.animations[index];
		Agile.Css.css3(agile.element, 'animation', '');
	}

	Timeline.kill = function(agile) {
		Timeline.removeAllFrames(agile);
		if (Timeline.callbacks[agile.id]) {
			Timeline.prefixEvent();
			agile.element.removeEventListener(Timeline.animationend, Timeline.callbacks[agile.id].fun);
			delete Timeline.callbacks[agile.id];
		}
	}

	Timeline.set = function(agile, frameObj) {
		if (!frameObj)
			return;
		for (var style in frameObj) {
			var newIndex = '_' + style + '_';
			var i = Agile.keyword.search(new RegExp(newIndex, 'i'));
			if (i <= -1) {
				if (style.indexOf('-') > -1) {
					var arr = style.split('-');
					for (var i = 0; i < arr.length; i++) {
						if (i != 0)
							arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
					}
					agile.css2(arr.join(''), frameObj[style]);
				} else {
					agile.css2(style, frameObj[style]);
				}
			} else {
				agile[style] = frameObj[style];
			}
		}
	}

	Timeline.addCallback = function(agile) {
		if (!Timeline.callbacks[agile.id]) {
			Timeline.callbacks[agile.id] = {
				fun : function(e) {
					for (var timelineIndex in agile.animations) {
						if (agile.animations[timelineIndex].indexOf(e.animationName) == 0) {
							Timeline.removeFrame(agile, timelineIndex, Timeline.callbacks[agile.id].removes[timelineIndex]);
							delete Timeline.callbacks[agile.id].removes[timelineIndex];

							Timeline.set(agile, Timeline.callbacks[agile.id].sets[timelineIndex]);
							delete Timeline.callbacks[agile.id].sets[timelineIndex];

							if (Timeline.callbacks[agile.id].completes[timelineIndex]) {
								if (Timeline.callbacks[agile.id].completes[timelineIndex].length == 1)
									Timeline.callbacks[agile.id].completes[timelineIndex][0].apply(agile);
								else
									Timeline.callbacks[agile.id].completes[timelineIndex][0].apply(agile, Timeline.callbacks[agile.id].completes[timelineIndex][1]);
								try{
									delete Timeline.callbacks[agile.id].completes[timelineIndex];
								}catch(e){}
							}
						}
					}
				},
				completes : {},
				removes : {},
				sets : {}
			}

			Timeline.prefixEvent();
			agile.element.addEventListener(Timeline.animationend, Timeline.callbacks[agile.id].fun, false);
		}

		return Timeline.callbacks[agile.id];
	}

	Timeline.prefixEvent = function() {
		if (!Timeline.animationend) {
			var prefix = Agile.Css.getPrefix();
			switch(prefix) {
				case 'Webkit':
					Timeline.animationend = 'webkitAnimationEnd';
					Timeline.animationiteration = 'webkitAnimationIteration';
					break;
				case 'ms':
					Timeline.animationend = 'MSAnimationEnd';
					Timeline.animationiteration = 'MSAnimationIteration';
					break;
				case 'O':
					Timeline.animationend = 'oanimationend';
					Timeline.animationiteration = 'oanimationiteration';
					break;
				case 'Moz':
					Timeline.animationend = 'animationend';
					Timeline.animationiteration = 'animationiteration';
					break;
				default:
					Timeline.animationend = 'animationend';
					Timeline.animationiteration = 'animationiteration';
			}
		}
	}

	Agile.Timeline = Timeline;
})(Agile);
