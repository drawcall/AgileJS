import Agile from "../core/Agile";
import Color from "../utils/Color";
import DisplayObject from "./DisplayObject";

export default class Triangle extends DisplayObject {
  constructor(width = 100, height = 173.2, color = "#00cc22") {
    super();

    this.css({
      width: "0px",
      height: "0px"
    });

    this.css(
      {
        borderStyle: "solid",
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        borderLeftColor: "transparent"
      },
      3
    );

    this._avatar.ox = 0;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = this.y = 0;
  }

  get color() {
    return this._avatar.color;
  }

  set color(color) {
    if (color === "random" || color === "#random") color = Color.randomColor();

    this._avatar.color = color;
    this.css3("borderBottomColor", this.color);
  }

  get originalWidth() {
    return this._avatar.originalWidth;
  }

  set originalWidth(originalWidth) {
    this._avatar.originalWidth = originalWidth;
  }

  get originalHeight() {
    return this._avatar.originalHeight;
  }

  set originalHeight(originalHeight) {
    this._avatar.originalHeight = originalHeight;
  }

  get width() {
    return this._avatar.width;
  }

  set width(width) {
    this._avatar.width = width;

    if (!this.originalWidth) {
      this.originalWidth = width;
      this.css(
        {
          borderWidth: "0px",
          borderRightWidth: width + "px",
          borderLeftWidth: width + "px"
        },
        3
      );
      this._avatar.ox = width / 2;
    } else {
      this.scaleX = this.width / this.originalWidth;
    }
  }

  get height() {
    return this._avatar.height;
  }

  set height(height) {
    this._avatar.height = height;

    if (!this.originalHeight) {
      this.originalHeight = height;
      this.css(
        {
          borderTopWidth: "0px",
          borderBottomWidth: height + "px"
        },
        3
      );
    } else {
      this.scaleY = this.height / this.originalHeight;
    }
  }

  get x() {
    return this._avatar.x + this._avatar.ox;
  }

  set x(x) {
    this._avatar.x = x - this._avatar.ox;
    this.transform();
  }

  transform() {
    let parentOffsetX, parentOffsetY, thisOffsetX, thisOffsetY, translate, rotate, scale, skew;

    if (Agile.mode === "3d" && Agile.support3d) {
      parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth : 0;
      parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight : 0;
      thisOffsetX = this.regX * this.originalWidth;
      thisOffsetY = this.regY * this.originalHeight;
      translate =
        "translate3d(" +
        (this._avatar.x - thisOffsetX + parentOffsetX) +
        "px," +
        (this.y - thisOffsetY + parentOffsetY) +
        "px," +
        this.z +
		"px) ";
		
      rotate =
        "rotateX(" +
        this.rotationX +
        "deg) " +
        "rotateY(" +
        this.rotationY +
        "deg) " +
        "rotateZ(" +
        this.rotationZ +
        "deg) ";
      scale = "scale3d(" + this.scaleX + "," + this.scaleY + "," + this.scaleZ + ") ";
      skew = "skew(" + this.skewX + "deg," + this.skewY + "deg)";

      this.css3("transform", translate + rotate + scale + skew);
    } else {
      parentOffsetX = this.parent ? this.parent.regX * this.parent.originalWidth : 0;
      parentOffsetY = this.parent ? this.parent.regY * this.parent.originalHeight : 0;
      thisOffsetX = this.regX * this.originalWidth;
      thisOffsetY = this.regY * this.originalHeight;
      translate =
        "translate(" +
        (this._avatar.x - thisOffsetX + parentOffsetX) +
        "px," +
        (this.y - thisOffsetY + parentOffsetY) +
        "px) ";
      rotate = "rotate(" + this.rotationZ + "deg) ";
      scale = "scale(" + this.scaleX + "," + this.scaleY + ") ";
      skew = "skew(" + this.skewX + "deg," + this.skewY + "deg)";

      this.css3("transform", translate + rotate + scale + skew);
    }
  }

  getCirumRadius() {
    const tha = 2 * Math.atan2(this.height, this.width);
    return this.width / Math.sin(tha);
  }

  regCircumcenter() {
    this.regY = this.getCirumRadius() / this.height;
  }

  toString() {
    return "Triangle";
  }
}
