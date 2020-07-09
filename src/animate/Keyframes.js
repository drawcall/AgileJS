import IDUtils from "../utils/IDUtils";
import Utils from "../utils/Utils";
import Color from "../utils/Color";

export default class Keyframes {
  constructor(...rest) {
    this.keyframes = { "100%": {} };

    this.label = IDUtils.generateID(this.toString());
    this.add.apply(this, rest);
  }

  /*
   * myKeyframes.add({time:15, color:'#000', x:2}, {time:25, color:'#fff'});
   * myKeyframes.add(30, { color: '#ccc' });
   * myKeyframes.add(60, alpha, 0);
   * myKeyframes.add('20%', alpha, 1);
   */
  add(...rest) {
    if (!rest.length) return;

    if (typeof rest[0] === "object") {
      const keyframe = rest[0];

      for (let key in keyframe) {
        const timevalue = keyframe[key];
        let time;

        if (Utils.isNumber(key)) {
          time = key + "%";
        } else {
          time = key.indexOf("%") > -1 ? key : key + "%";
        }

        delete keyframe[`${key}`];
        keyframe[time] = timevalue;
        this.setColor(keyframe[time]);
      }

      Object.assign(this.keyframes, keyframe);
    } else {
      let time = Utils.isNumber(rest[0]) ? rest[0] + "%" : rest[0];
      let keyframe = {};
      let style;
      let value;

      if (rest.length === 3) {
        style = rest[1];
        value = rest[2];

        keyframe[time] = {};
        keyframe[time][style] = value;
      } else {
        value = rest[1];
        keyframe[time] = value;
      }

      this.setColor(keyframe[time]);
      Object.assign(this.keyframes, keyframe);
    }

    this.fill();
  }

  get(time) {
    if (Utils.isNumber(time)) time = time + "%";
    return this.keyframes[time];
  }

  remove(time) {
    time = Utils.isNumber(time) ? time + "%" : time;
    if (time) delete this.keyframes[time];
    else this.destroy();
  }

  fill() {
    this.sort();
    let prevValue;

    for (let time in this.keyframes) {
      const frame = this.keyframes[time];

      for (let key in prevValue) {
        if (frame[key] === undefined) frame[key] = prevValue[key];
      }

      prevValue = frame;
    }
  }

  sort() {
    const cloneObj = {};
    const keys = Utils.keys(this.keyframes);
    keys.sort((a, b) => parseFloat(a) - parseFloat(b));

    for (let i = 0, len = keys.length; i < len; i++) {
      let k = keys[i];
      cloneObj[k] = this.keyframes[k];
    }

    this.keyframes = cloneObj;
    return this.keyframes;
  }

  merge() {
    const obj = {};

    for (let time in this.keyframes) {
      for (let key in this.keyframes[time]) obj[key] = this.keyframes[time][key];
    }

    return obj;
  }

  setColor(obj) {
    if (obj.color) {
      if (obj.color === "random") obj.color = Color.randomColor();
    }
  }

  destroy() {
    Utils.destroyObject(this.keyframes);
  }

  toString() {
    return "Keyframes";
  }
}
