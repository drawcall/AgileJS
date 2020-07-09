import Css from "../core/Css";
import Agile from "../core/Agile";
import Utils from "../utils/Utils";
import IDUtils from "../utils/IDUtils";
import Dom from "./Dom";

export default class Container extends Dom {
  constructor(dom = "2d", mode = "2d") {
    super(dom);

    if (dom && dom !== "3d" && dom !== "2d") this._avatar.dom = dom;

    this._avatar.mode = "2d";
    this._avatar.regX = Utils.getCssValue(this, "transformOrigin", 0, 3) || 0.5;
    this._avatar.regY = Utils.getCssValue(this, "transformOrigin", 1, 3) || 0.5;

    this._avatar.perspectiveOriginX = 0.5;
    this._avatar.perspectiveOriginY = 0.5;
    this._avatar.perspectiveOriginZ = 0;

    if (dom === "3d" || mode === "3d") this.mode = "3d";
    else this.mode = "2d";

    Agile.containers.push(this);
  }

  createElement() {
    if (this.dom) return this.dom;

    this._avatar.id = IDUtils.generateID(this.toString());
    this.element = Css.createElement();
    Css.attr(this.element, "id", this._avatar.id);
  }

  get mode() {
    return this._avatar.mode;
  }

  set mode(mode) {
    this._avatar.mode = mode;
    mode = mode === "2d" ? "flat" : "preserve-3d";
    this.css3("transformStyle", mode);
  }

  get perspective() {
    return this._avatar.perspective;
  }

  set perspective(perspective) {
    this._avatar.perspective = perspective;
    this.css3("perspective", perspective + "px");
  }

  get perspectiveOriginX() {
    return this._avatar.perspectiveOriginX;
  }

  set perspectiveOriginX(perspectiveOriginX) {
    this._avatar.perspectiveOriginX = perspectiveOriginX;
    const ox = this.perspectiveOriginX * 100 + "%";
    const oy = this.perspectiveOriginY * 100 + "%";

    this.css3("perspectiveOrigin", ox + " " + oy);
  }

  get perspectiveOriginY() {
    return this._avatar.perspectiveOriginY;
  }

  set perspectiveOriginY(perspectiveOriginY) {
    this._avatar.perspectiveOriginY = perspectiveOriginY;
    const ox = this.perspectiveOriginX * 100 + "%";
    const oy = this.perspectiveOriginY * 100 + "%";

    this.css3("perspectiveOrigin", ox + " " + oy);
  }

  get perspectiveOriginZ() {
    return this._avatar.perspectiveOriginZ;
  }

  set perspectiveOriginZ(perspectiveOriginZ) {
    this._avatar.perspectiveOriginZ = perspectiveOriginZ;
    const ox = this.perspectiveOriginX * 100 + "%";
    const oy = this.perspectiveOriginY * 100 + "%";
    const oz = this.perspectiveOriginZ + "px";

    this.css3("perspectiveOrigin", ox + " " + oy + " " + oz);
  }

  addChild(obj) {
    super.addChild(obj);
    obj.backface = this.backface;

    if (Agile.backface === false) obj.backface = false;
  }

  toString() {
    return "Container";
  }

  destroy() {
    super.destroy();
    Utils.arrayRemove(Agile.containers, this);
  }
}
