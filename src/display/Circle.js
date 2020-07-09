import DisplayObject from "./DisplayObject";

export default class Circle extends DisplayObject {
  constructor(radius = 25, color = "purple") {
    super();

    this.radius = radius;
    this.background(color);
  }

  get radius() {
    return this._avatar.radius;
  }

  set radius(radius) {
    this._avatar.radius = radius;
    this.width = this.height = this.radius * 2;
    this.css3("borderRadius", "50%");
  }

  toString() {
    return "Circle";
  }
}
