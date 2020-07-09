export default {
  select(val) {
    if (/^(#|\.).*/g.test(val) || val === "body") return document.querySelector(val);
    else return document.getElementById(val);
  },

  createElement(tag = "div") {
    return document.createElement(tag);
  },

  attr(element, key, val) {
    if (val === undefined) return element.getAttribute(key);
    element.setAttribute(key, val);
  },

  css(element, style, value = 2) {
    if (typeof style === "object") {
      for (let ss in style) {
        if (value === 2) this.css2(element, ss, style[ss]);
        else this.css3(element, ss, style[ss]);
      }

      return null;
    } else {
      return this.css2(element, style, value);
    }
  },

  css2(element, style, value) {
    if (!(value === undefined)) {
      element.style[`${style}`] = value;
      return value;
    } else {
      const computedStyle = getComputedStyle(element, "");
      return element.style[`${style}`] || computedStyle.getPropertyValue(`${style}`);
    }
  },

  css3j(element, style, value) {
    element.style[style] = `-webkit-${value}`;
    element.style[style] = `-moz-${value}`;
    element.style[style] = `-ms-${value}`;
    element.style[style] = `-o-${value}`;
    element.style[style] = `${value}`;
  },

  css3(element, style, value) {
    const fixStyle = style.charAt(0).toUpperCase() + style.substr(1);

    if (!(value === undefined)) {
      element.style[`Webkit${fixStyle}`] = value;
      element.style[`Moz${fixStyle}`] = value;
      element.style[`ms${fixStyle}`] = value;
      element.style[`O${fixStyle}`] = value;
      element.style[`${style}`] = value;
    } else {
      return this.getCss3(element, style);
    }
  },

  getCss3(element, style) {
    const computedStyle = getComputedStyle(element, "");
    const a =
      element.style["" + style] ||
      element.style["-webkit-" + style] ||
      element.style["-o-" + style] ||
      element.style["-ms-" + style] ||
      element.style["-moz-" + style];
    const b =
      computedStyle.getPropertyValue("" + style) ||
      computedStyle.getPropertyValue("-webkit- " + style) ||
      computedStyle.getPropertyValue("-o-" + style) ||
      computedStyle.getPropertyValue("-ms-" + style) ||
      computedStyle.getPropertyValue("-moz-" + style);

    return a || b;
  },

  bakCss3(element, style, value) {
    if (!(value === undefined)) {
      element.style["-webkit-" + style] = value;
      element.style["-moz-" + style] = value;
      element.style["-ms-" + style] = value;
      element.style["-o-" + style] = value;
      element.style["" + style] = value;

      return value;
    } else {
      const computedStyle = getComputedStyle(element, "");
      const a =
        element.style["" + style] ||
        element.style["-webkit-" + style] ||
        element.style["-o-" + style] ||
        element.style["-ms-" + style] ||
        element.style["-moz-" + style];
      const b =
        computedStyle.getPropertyValue("" + style) ||
        computedStyle.getPropertyValue("-webkit- " + style) ||
        computedStyle.getPropertyValue("-o-" + style) ||
        computedStyle.getPropertyValue("-ms-" + style) ||
        computedStyle.getPropertyValue("-moz-" + style);
      return a || b;
    }
  },

  addClass(element, newClassName) {
    const className = element.className;
    const blank = className !== "" ? " " : "";

    if (!this.hasClass(element, newClassName)) element.className = className + blank + newClassName;
  },

  removeClass(element, cls) {
    if (this.hasClass(element, cls)) {
      const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
      element.className = element.className.replace(reg, "");
    }
  },

  hasClass(element, className) {
    return element.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
  },

  getDynamicSheet() {
    if (!this["dynamicSheet"]) {
      const style = document.createElement("style");
      style.rel = "stylesheet";
      style.type = "text/css";
      document.getElementsByTagName("head")[0].appendChild(style);
      this["dynamicSheet"] = style.sheet;
    }

    return this["dynamicSheet"];
  },

  getTestElement() {
    if (!this["testElement"]) this["testElement"] = document.createElement("div");
    return this["testElement"];
  },

  getPrefix(type = 1) {
    let prefix = "";
    const prefixs = ["Moz", "Webkit", "ms", "O", ""];

    for (let i = 0, length = prefixs.length; i < length; i++) {
      let css3Prefix = prefixs[i];
      if (`${css3Prefix}Transition` in this.getTestElement().style) {
        if (type !== 1) {
          prefix = css3Prefix.toLocaleLowerCase();
          if (prefix !== "") prefix = "-" + prefix + "-";
        } else {
          prefix = css3Prefix;
        }

        return prefix;
      }
    }
    return prefix;
  },

  support3d() {
    let support3d;
    const el = document.createElement("p");
    const transforms = {
      webkitTransform: "-webkit-transform",
      OTransform: "-o-transform",
      msTransform: "-ms-transform",
      MozTransform: "-moz-transform",
      transform: "transform"
    };

    document.body.insertBefore(el, null);
    for (let t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = "translate3d(1px,1px,1px)";
        support3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
      }
    }

    document.body.removeChild(el);
    return support3d !== undefined && support3d.length > 0 && support3d !== "none";
  }
};
