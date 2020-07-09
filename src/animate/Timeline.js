import Avatar from "./Avatar";
import Agile from "../core/Agile";
import Css from "../core/Css";
import Keyframes from "./Keyframes";
import Text from "../display/Text";
import Utils from "../utils/Utils";
import JsonUtils from "../utils/JsonUtils";

export default {
  index: 0,
  callbacks: {},
  currentTime: 0,
  nextTween: [],
  replace: false,
  remove: true,

  get avatar() {
    if (!this.avatarmc) this.avatarmc = new Avatar(1, 1);
    return this.avatarmc;
  },

  addFrame(agile, duration, frameObj, paramsObj) {
    let keyframe;

    if (frameObj instanceof Keyframes) {
      if (!paramsObj) paramsObj = {};

      this.insertKeyframes(agile, frameObj, paramsObj["replace"]);
      this.apply(agile, duration, frameObj, paramsObj);
    } else if (typeof frameObj === "object") {
      if (frameObj.hasOwnProperty("frame")) keyframe = frameObj["frame"];
      else keyframe = paramsObj;

      this.insertKeyframes(agile, keyframe, frameObj["replace"]);
      this.apply(agile, duration, keyframe, frameObj);
    }

    return this.index++;
  },

  playFrame(agile, duration, frameObj, paramsObj) {
    let keyframe;

    if (frameObj instanceof Keyframes) {
      if (!paramsObj) paramsObj = {};
      this.apply(agile, duration, frameObj, paramsObj);
    } else if (typeof frameObj === "object") {
      if (frameObj.hasOwnProperty("frame")) keyframe = frameObj["frame"];
      else keyframe = paramsObj;

      this.apply(agile, duration, keyframe, frameObj);
    }

    return this.index++;
  },

  insertKeyframes(agile, keyframes, replace) {
    if (replace || this.replace) this.removeKeyframes(agile.id + "_" + keyframes.label);

    const prefix = Css.getPrefix(2);
    this.avatar.clearStyle();
    this.avatar.copySelf(agile, "all");

    const keys = {};
    for (let time in keyframes.keyframes) {
      let timeObj = keyframes.keyframes[time];
      keys[time] = {};

      for (let style in timeObj) {
        let newIndex = `_${style}_`;
        let i = Agile.keyword.search(new RegExp(newIndex, "i"));

        if (i <= -1) {
          if (style.indexOf("-") > -1) {
            let arr = style.split("-");
            for (let i = 0; i < arr.length; i++) {
              if (i !== 0) arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
            }

            this.avatar.css2(arr.join(""), timeObj[style]);
          } else {
            this.avatar.css2(style, timeObj[style]);
          }
        } else {
          this.avatar[style] = timeObj[style];
        }

        switch (style) {
          case "alpha":
            keys[time]["opacity"] = this.avatar[style];
            break;

          case "color":
            if (!(agile instanceof Text)) {
              keys[time]["background-color"] = this.avatar[style];
            }
            break;

          case "x":
          case "y":
          case "z":
          case "scaleX":
          case "scaleY":
          case "scaleZ":
          case "rotation":
          case "rotationX":
          case "rotationY":
          case "rotationZ":
          case "skewX":
          case "skewY":
          case "width":
          case "height":
            keys[time][prefix + "transform"] = this.avatar.css3("transform");
            break;

          case "regX":
          case "regY":
            keys[time][prefix + "transform-origin"] = this.avatar.css3("transformOrigin");
            break;

          case "originalWidth":
            keys[time]["width"] = this.avatar.css2("width");
            break;

          case "originalHeight":
            keys[time]["height"] = this.avatar.css2("height");
            break;

          case "round":
            keys[time]["border-radius"] = this.avatar[style] + "px";
            break;

          default:
            keys[time][style] = this.avatar.css2(style);
        }
      }
    }

    const keyframesTag = `@${prefix}keyframes`;
    let styles = Css.getDynamicSheet();
    let paramsObj = JsonUtils.object2Json(keys);
    paramsObj = JsonUtils.replaceChart(paramsObj);

    const css = keyframesTag + " " + agile.id + "_" + keyframes.label + paramsObj;
    styles.insertRule(css, styles.cssRules.length);
    styles = null;
  },

  apply(agile, duration, keyframe, paramsObj) {
    let animation = "";
    const label = typeof keyframe === "string" ? keyframe : keyframe.label;
    animation += agile.id + "_" + label + " ";
    animation += duration + "s ";

    if (paramsObj["ease"]) animation += paramsObj["ease"] + " ";
    if (paramsObj["delay"]) animation += paramsObj["delay"] + "s ";

    if (paramsObj["loop"]) {
      if (paramsObj["loop"] <= 0) paramsObj["loop"] = "infinite";
      animation += paramsObj["loop"] + " ";
    } else if (paramsObj["repeat"]) {
      if (paramsObj["repeat"] <= 0) paramsObj["repeat"] = "infinite";
      animation += paramsObj["repeat"] + " ";
    }

    if (paramsObj["yoyo"]) {
      if (paramsObj["yoyo"] === true) paramsObj["yoyo"] = "alternate";
      if (paramsObj["yoyo"] === false) paramsObj["yoyo"] = "normal";
      animation += paramsObj["yoyo"] + " ";
    }

    animation += "forwards";

    const preTransition = Utils.isEmpty(agile.animations) ? "" : Css.css3(agile.element, "animation") + ", ";
    agile.animations[`${this.index}`] = animation;
    animation = preTransition + animation;
    agile.css3("animation", animation);

    this.addCallback(agile);

    const callback = this.callbacks[agile.id];
    callback.sets[`${this.index}`] = keyframe.merge();
    callback.removes[`${this.index}`] = paramsObj["remove"] || this.remove;

    // add complete handler
    if (paramsObj["onComplete"]) {
      if (paramsObj["onCompleteParams"])
        callback.completes[`${this.index}`] = [paramsObj["onComplete"], paramsObj["onCompleteParams"]];
      else callback.completes[`${this.index}`] = [paramsObj["onComplete"]];
    }
  },

  removeKeyframes(frame) {
    const keyName = typeof frame === "string" ? frame : frame.label;
    this.eachStyles((rule, i, styles) => {
      if (rule.name === keyName) styles.deleteRule(i);
    });
  },

  indexOf(frame) {
    let index = -100;

    const keyName = typeof frame === "string" ? frame : frame.label;
    this.eachStyles((rule, i) => {
      if (rule.name === keyName) index = 100;
    });

    return index;
  },

  eachStyles(callback) {
    const styles = Css.getDynamicSheet();
    const rules = styles.cssRules || styles.rules || [];

    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      if (
        rule.type === CSSRule.KEYFRAMES_RULE ||
        rule.type === CSSRule.MOZ_KEYFRAMES_RULE ||
        rule.type === CSSRule.WEBKIT_KEYFRAMES_RULE ||
        rule.type === CSSRule.O_KEYFRAMES_RULE ||
        rule.type === CSSRule.MS_KEYFRAMES_RULE
      ) {
        callback(rule, i, styles, rules);
      }
    }
  },

  pause(agile) {
    Css.css3(agile.element, "animationPlayState", "paused");
  },

  resume(agile) {
    Css.css3(agile.element, "animationPlayState", "running");
  },

  toggle(agile) {
    if (Css.css3(agile.element, "animationPlayState") === "running") this.pause(agile);
    else this.resume(agile);
  },

  removeFrameByIndex(agile, index) {
    index = index + "";
    const deleteItem = agile.animations[index];

    if (deleteItem) {
      agile.animations[index] = "0";
      let animation = JsonUtils.object2String(agile.animations);

      if (Utils.replace(animation, ["0,", "0", " "], "") === "") this.removeAllFrames(agile);
      else agile.css3("animation", animation);
    }

    return deleteItem;
  },

  removeFrame(agile, frame, removeStyle) {
    let timelineIndex;
    let keyframes;

    if (Utils.isNumber(frame)) {
      timelineIndex = frame;
      keyframes = agile.animations[timelineIndex + ""];
    } else if (typeof frame === "string") {
      if (frame.indexOf(agile.id) > -1) keyframes = frame;
      else keyframes = agile.id + "_" + frame;

      timelineIndex = Utils.objectforkey(agile.animations, keyframes);
    } else {
      keyframes = agile.id + "_" + frame.label;
      timelineIndex = Utils.objectforkey(agile.animations, keyframes);
    }

    if (removeStyle) this.removeKeyframes(keyframes);
    return this.removeFrameByIndex(agile, timelineIndex);
  },

  removeFrameAfter(agile, frame, complete, removeStyle) {
    this.getPrefixEvent();
    agile.element.addEventListener(this.animationiteration, animationiterationHandler, false);

    function animationiterationHandler(e) {
      this.removeFrame(agile, frame, removeStyle);
      agile.element.removeEventListener(this.animationiteration, animationiterationHandler);

      complete && complete();
    }
  },

  removeAllFrames(agile) {
    for (let index in agile.animations) delete agile.animations[index];
    Css.css3(agile.element, "animation", "");
  },

  kill(agile) {
    this.removeAllFrames(agile);

    if (this.callbacks[agile.id]) {
      this.getPrefixEvent();
      agile.element.removeEventListener(this.animationend, this.callbacks[agile.id].fun);
      delete this.callbacks[agile.id];
    }
  },

  set(agile, frameObj) {
    if (!frameObj) return;

    for (let style in frameObj) {
      let newIndex = `_${style}_`;
      let i = Agile.keyword.search(new RegExp(newIndex, "i"));

      if (i > -1) {
        agile[style] = frameObj[style];
        continue;
      }

      if (style.indexOf("-") > -1) {
        let arr = style.split("-");
        for (let i = 0; i < arr.length; i++) {
          if (i !== 0) arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
        }

        agile.css2(arr.join(""), frameObj[style]);
      } else {
        agile.css2(style, frameObj[style]);
      }
    }
  },

  addCallback(agile) {
    if (this.callbacks[agile.id]) return this.callbacks[agile.id];

    this.callbacks[agile.id] = {
      fun: e => {
        const callback = this.callbacks[agile.id];

        for (let index in agile.animations) {
          if (agile.animations[index].indexOf(e.animationName) !== 0) continue;

          this.removeFrame(agile, index, callback.removes[index]);
          delete callback.removes[index];

          this.set(agile, callback.sets[index]);
          delete callback.sets[index];

          if (callback.completes[index]) {
            if (callback.completes[index].length === 1) callback.completes[index][0].apply(agile);
            else callback.completes[index][0].apply(agile, callback.completes[index][1]);

            try {
              delete callback.completes[index];
            } catch (e) {}
          }
        }
      },
      completes: {},
      removes: {},
      sets: {}
    };

    this.getPrefixEvent();
    agile.element.addEventListener(this.animationend, this.callbacks[agile.id].fun, false);

    return this.callbacks[agile.id];
  },

  getPrefixEvent() {
    if (this.animationend) return this.animationend;

    const prefix = Css.getPrefix();
    switch (prefix) {
      case "Webkit":
        this.animationend = "webkitAnimationEnd";
        this.animationiteration = "webkitAnimationIteration";
        break;

      case "ms":
        this.animationend = "MSAnimationEnd";
        this.animationiteration = "MSAnimationIteration";
        break;

      case "O":
        this.animationend = "oanimationend";
        this.animationiteration = "oanimationiteration";
        break;

      case "Moz":
        this.animationend = "animationend";
        this.animationiteration = "animationiteration";
        break;

      default:
        this.animationend = "animationend";
        this.animationiteration = "animationiteration";
    }

    return this.animationend;
  }
};
