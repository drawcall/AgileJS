(function (Agile, undefined) {
    var _intervalID;

    function SpriteSheet(imgArr, width, height, speed, useIntervl, useCssSprite) {
        SpriteSheet._super_.call(this);
        _intervalID = -1;
        this.imgArr = imgArr;
        if (typeof speed == 'boolean') {
            this.speed = 30;
            this.useCssSprite = this.speed;
        } else {
            this.speed = speed || 30;
            this.useCssSprite = useCssSprite || false;
        }
        this.useIntervl = useIntervl || true;
        this.state = 'stop';
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

    Agile.Utils.inherits(SpriteSheet, Agile.DisplayObject);

    SpriteSheet.prototype.setBackgroundImage = function () {
        if (this.useCssSprite) {
            this.removeClass(this.imgArr[this.prevFrame - 1]);
            this.addClass(this.imgArr[this.currentFrame - 1]);
        } else {
            this.backgroundImage = this.imgArr[this.currentFrame - 1];
        }
    }

    SpriteSheet.prototype.play = function () {
        if (this.useIntervl) {
            var _self = this;
            if (_intervalID < 0)
                _intervalID = setInterval(function () {
                    _self.update.apply(_self);
                }, 1000 / this.speed);
        }
        this.state = 'play';
    }

    SpriteSheet.prototype.stop = function (clear) {
        if (this.useIntervl && clear) {
            clearInterval(_intervalID);
            _intervalID = -1;
        }
        this.state = 'stop';
    }

    SpriteSheet.prototype.gotoAndPlay = function (frame) {
        this.currentFrame = frame;
        this.setBackgroundImage();
        this.play();
        this.state = 'play';
    }

    SpriteSheet.prototype.gotoAndStop = function (frame) {
        this.currentFrame = frame;
        this.setBackgroundImage();
        this.stop();
        this.state = 'stop';
    }

    SpriteSheet.prototype.update = function () {
        if (this.state == 'stop')
            return;

        if (!this.useIntervl) {
            if (!this.oldTime)
                this.oldTime = new Date().getTime();
            var time = new Date().getTime();
            this.elapsed += (time - this.oldTime);
            this.oldTime = time;

            if (this.elapsed >= 1000 / this.speed) {
                this.elapsed = this.elapsed % (1000 / this.speed);
            } else {
                return;
            }
        }

        this.render();
    }

    SpriteSheet.prototype.render = function () {
        //The use of two times for a reason
        if (this.state == 'stop')
            return;

        this.prevFrame = this.currentFrame;

        if (this.prvePlay)
            this.currentFrame--;
        else
            this.currentFrame++;

        if (this.prvePlay) {
            if (this.loop) {
                if (this.currentFrame < 1)
                    this.currentFrame = this.totalFrames;
            } else {
                if (this.currentFrame <= 1) {
                    this.currentFrame = 1;
                    this.stop();
                }
            }
        } else {
            if (this.loop) {
                if (this.currentFrame > this.totalFrames)
                    this.currentFrame = 1;
            } else {
                if (this.currentFrame >= this.totalFrames) {
                    this.currentFrame = this.totalFrames;
                    this.stop();
                }
            }
        }

        this.setBackgroundImage();
    }

    SpriteSheet.prototype.toString = function () {
        return 'SpriteSheet';
    }

    Agile.SpriteSheet = SpriteSheet;
})(Agile);
