import DisplayObject from "./DisplayObject";

let intervalId;

export default class SpriteSheet extends DisplayObject {
  constructor(imgArr, width, height, speed, useIntervl = true, useCssSprite = false) {
    super();

    intervalId = -1;
    this.imgArr = imgArr;
    if (typeof speed === "boolean") {
      this.speed = 30;
      this.useCssSprite = this.speed;
    } else {
      this.speed = speed || 30;
      this.useCssSprite = useCssSprite;
    }

    this.useIntervl = useIntervl;
    this.state = "stop";

    this.originalHeight = height;
    this.originalWidth = width;
    this.currentFrame = 1;
    this.prevFrame = this.currentFrame;
    this.totalFrames = imgArr.length;

    this.setBackgroundImage();

    this.loop = true;
    this.prvePlay = false;
    this.elapsed = 0;
    this.stop();
  }

  setBackgroundImage() {
    if (this.useCssSprite) {
      this.removeClass(this.imgArr[this.prevFrame - 1]);
      this.addClass(this.imgArr[this.currentFrame - 1]);
    } else {
      this.backgroundImage = this.imgArr[this.currentFrame - 1];
    }
  }

  play() {
    if (this.useIntervl) {
      if (intervalId < 0) intervalId = setInterval(() => this.update(), 1000 / this.speed);
    }

    this.state = "play";
  }

  stop(clear) {
    if (this.useIntervl && clear) {
      clearInterval(intervalId);
      intervalId = -1;
    }

    this.state = "stop";
  }

  gotoAndPlay(frame) {
    this.currentFrame = frame;
    this.setBackgroundImage();
    this.play();
    this.state = "play";
  }

  gotoAndStop(frame) {
    this.currentFrame = frame;
    this.setBackgroundImage();
    this.stop();
    this.state = "stop";
  }

  update() {
    if (this.state === "stop") return;

    if (!this.useIntervl) {
      if (!this.oldTime) this.oldTime = new Date().getTime();

      const time = new Date().getTime();
      this.elapsed += time - this.oldTime;
      this.oldTime = time;

      if (this.elapsed >= 1000 / this.speed) {
        this.elapsed = this.elapsed % (1000 / this.speed);
      } else {
        return;
      }
    }

    this.render();
  }

  render() {
    // The use of two times for a reason
    if (this.state === "stop") return;

    this.prevFrame = this.currentFrame;

    if (this.prvePlay) this.currentFrame--;
    else this.currentFrame++;

    if (this.prvePlay) {
      if (this.loop) {
        if (this.currentFrame < 1) this.currentFrame = this.totalFrames;
      } else {
        if (this.currentFrame <= 1) {
          this.currentFrame = 1;
          this.stop();
        }
      }
    } else {
      if (this.loop) {
        if (this.currentFrame > this.totalFrames) this.currentFrame = 1;
      } else {
        if (this.currentFrame >= this.totalFrames) {
          this.currentFrame = this.totalFrames;
          this.stop();
        }
      }
    }

    this.setBackgroundImage();
  }

  toString() {
    return "SpriteSheet";
  }
}
