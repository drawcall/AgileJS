export default class MovieClipLabel {
  constructor(label, x1, y1, x2, y2, frames = 1) {
    if (typeof x1 === "object") {
      this.from = x1.from;
      this.to = x1.to;
      this.label = label;
      this.totalframes = x1.totalframes || 1;
    } else {
      this.label = label;
      this.from = {
        x: x1,
        y: y1
      };

      this.to = {
        x: x2,
        y: y2
      };

      this.totalframes = frames;
    }
  }

  toString() {
    return "MovieClipLabel";
  }
}
