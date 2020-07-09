import Css from "../core/Css";
import Text from "../display/Text";
import Color from "../utils/Color";
import Utils from "../utils/Utils";

export default class Filter {
  constructor(type) {
    this.type = type;
    this.elements = [];
    this.styleObj = {};
    this.arguments = arguments;
    this.a = this.b = this.c = this.d = this.e = this.f = this.g = null;
  }

  apply(agileEle) {
    this.elements.push(agileEle);
    this.styleObj[agileEle.id] = { style: "", value: "" };

    switch (this.type) {
      case "stroke":
        this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
        this.b = this.arguments.length > 2 ? this.arguments[2] : "#000";
        break;

      case "blur":
        this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
        this.b = this.arguments.length > 2 ? this.arguments[2] : "#000";
        break;

      case "shadow":
        this.a = this.arguments.length > 1 ? this.arguments[1] : 3;
        this.b = this.arguments.length > 2 ? this.arguments[2] : 3;
        this.c = this.arguments.length > 3 ? this.arguments[3] : 5;
        this.d = this.arguments.length > 4 ? this.arguments[4] : "#000";
        break;

      case "glow":
        this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
        this.b = this.arguments.length > 2 ? this.arguments[2] : "#000";
        break;

      case "insetglow":
      case "insetGlow":
      case "inset-glow":
        this.a = this.arguments.length > 1 ? this.arguments[1] : 5;
        this.b = this.arguments.length > 2 ? this.arguments[2] : "#000";
        break;

      case "3d":
        this.a = this.arguments.length > 1 ? this.arguments[1] : 6;
        this.b = this.arguments.length > 2 ? this.arguments[2] : "#000";
        break;
    }

    this.reset(agileEle);
  }

  reset(elements) {
    let thisAgiles = elements === undefined ? this.elements : [elements];

    for (let i = 0, length = thisAgiles.length; i < length; i++) {
      let agileEle = thisAgiles[i];
      this.styleObj[agileEle.id].value = "";

      switch (this.type) {
        case "stroke":
          if (agileEle instanceof Text) {
            const s1 = -this.a + "px " + -this.a + "px 0 " + this.b;
            const s2 = this.a + "px " + -this.a + "px 0 " + this.b;
            const s3 = -this.a + "px " + this.a + "px 0 " + this.b;
            const s4 = this.a + "px " + this.a + "px 0 " + this.b;

            this.styleObj[agileEle.id].value = `${s1},${s2},${s3},${s4}`;
          } else {
            this.styleObj[agileEle.id].value = `0 0 0 ${this.a}px ${this.b}`;
          }
          break;

        case "blur":
          Css.css2(agileEle.element, "color", Color.alpha0);
          Css.css3(agileEle.element, "background", Color.alpha0);
          this.styleObj[agileEle.id].value = `0 0 ${this.a}px ${this.b}`;
          break;

        case "shadow":
          this.styleObj[agileEle.id].value = `${this.a}px ${this.b}px ${this.c}px ${this.d}`;
          break;

        case "glow":
          this.styleObj[agileEle.id].value = `0 0 ${this.a}px ${this.b}`;
          break;

        case "insetglow":
        case "insetGlow":
        case "inset-glow":
          this.styleObj[agileEle.id].value = `inset 0 0 ${this.a}px ${this.b}`;
          break;

        case "3d":
          for (let i = 1, length = this.a; i <= length; i++) {
            if (i === length) this.styleObj[agileEle.id].value += `${i}px ${i}px ${this.b}`;
            else this.styleObj[agileEle.id].value += `${i}px ${i}px ${this.b},`;
          }

          break;
      }

      if (agileEle instanceof Text) this.styleObj[agileEle.id].style = "textShadow";
      else this.styleObj[agileEle.id].style = "boxShadow";

      Css.css3(agileEle.element, this.styleObj[agileEle.id].style, this.styleObj[agileEle.id].value);
    }
  }

  erase(agileEle) {
    Utils.arrayRemove(this.elements, agileEle);
    Css.css3(agileEle.element, this.styleObj[agileEle.id].style, null);
    delete this.styleObj[agileEle.id];
  }
}
