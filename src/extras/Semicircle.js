import DisplayObject from "../display/DisplayObject";

export default class Semicircle extends DisplayObject {
  constructor(radius = 25, color = "purple") {
    super();

    this.radius = radius;
    this.background(color);
    this.x = this.y = 0;
  }

  get radius() {
    return this._avatar.radius;
  }

  set radius(radius) {
    this._avatar.radius = radius;
    this.width = this.radius * 2;
    this.height = this.radius;

    this.css3("borderRadius", `${this.radius}px ${this.radius}px 0 0`);
  }

  toString() {
    return "Semicircle";
  }
}
