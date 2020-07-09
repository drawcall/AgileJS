import DisplayObject from "../display/DisplayObject";

export default class Avatar extends DisplayObject {
  constructor(width = 50, height, color = "blur") {
    super();

    this.width = width;
    this.height = height || this.width;

    this.background(color);
    this.x = this.y = 0;

    this.parent = {
      originalWidth: 0,
      originalHeight: 0,
      regX: 0,
      regY: 0
    };
  }

  clearStyle() {
    this.css3("transform", "");
    this.element.style.cssText = "";
    this.element.style = "";
  }

  copyParent(parent) {
    this.parent.regX = parent.regX;
    this.parent.regY = parent.regY;
    this.parent.originalWidth = parent.originalWidth;
    this.parent.originalHeight = parent.originalHeight;
  }

  copySelf(self, copyAll) {
    this.regX = self.regX;
    this.regY = self.regY;
    this.originalWidth = self.originalWidth;
    this.originalHeight = self.originalHeight;

    if (self.parent) this.copyParent(self.parent);

    if (copyAll) {
      this.x = self.x;
      this.y = self.y;
      this.z = self.z;

      this.scaleX = self.scaleX;
      this.scaleY = self.scaleY;
      this.scaleZ = self.scaleZ;

      this.rotation = self.rotation;
      this.rotationX = self.rotationX;
      this.rotationY = self.rotationY;
      this.rotationZ = self.rotationZ;

      this.skewX = self.skewX;
      this.skewY = self.skewY;
    }
  }

  toString() {
    return "Avatar";
  }
}
