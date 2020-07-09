import DisplayObject from "./DisplayObject";

export default class Rect extends DisplayObject {
  constructor(width = 50, height, color) {
    super();

    this.x = this.y = 0;
    this.width = width;
    this.height = height || this.width;

    color = color || "blue";
    this.background(color);
  }

  get round() {
    return this._avatar.round;
  }

  set round(round) {
    this._avatar.round = round;
    this.css3("borderRadius", this.round + "px");
  }

  toString() {
    return "Rect";
  }
}
