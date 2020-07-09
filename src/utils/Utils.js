export default {
  keys(object) {
    return Object.keys(object);
  },

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  isArray(val) {
    return Object.prototype.toString.call(val) === "[object Array]";
  },

  isEmpty(obj) {
    if (!obj) return true;

    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
  },

  isMobile() {
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      window.navigator.userAgent.toLowerCase()
    );
  },

  arrayRemove(arr, val) {
    const index = arr.indexOf(val);
    if (index > -1) arr.splice(index, 1);

    return index;
  },

  destroyObject(obj) {
    for (let o in obj) delete obj[o];
  },

  objectforkey(obj, val) {
    for (let key in obj) {
      let index = obj[key].indexOf(val);
      if (index === 0 && obj[key].charAt(index + val.length) === " ") return key;
    }

    return null;
  },

  initValue(a, b) {
    const s = a === undefined || a === null ? b : a;
    return s;
  },

  getCssValue(agileEle, style, index, css3) {
    let str;
    if (css3 === 3) str = this.getStyleBySpace(agileEle.css3(style), index);
    else str = this.getStyleBySpace(agileEle.css2(style), index);

    return str ? this.otherToFloat(str) : null;
  },

  getStyleBySpace(str, index) {
    if (!str) return null;
    const arr = str.split(" ");

    if (index >= arr.lenght) return null;
    else return arr[index];
  },

  replace(str, a, b) {
    let s = "";
    if (this.isArray(a)) {
      for (let i = 0; i < a.length; i++) {
        // if (i != a.length - 1)
        s += a[i] + "|";
      }
    } else {
      s = a;
    }

    return str.replace(new RegExp(s, "gm"), b);
  },

  browser() {
    const isOpera = (window.opr && window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
    const isChrome = !!window.chrome && !!window.chrome.webstore;

    return { isOpera, isFirefox, isSafari, isIE, isChrome };
  },

  getMouseEvent(type) {
    const isMobile = this.isMobile();
    switch (type) {
      case "down":
      case "mousedown":
        return !isMobile ? "mousedown" : "touchstart";

      case "move":
      case "mousemove":
        return !isMobile ? "mousemove" : "touchmove";

      case "up":
      case "mouseup":
        return !isMobile ? "mouseup" : "touchend";
    }
  }
};
