export default {
  GROUP_LOADED: "groupLoaded",
  SINGLE_LOADED: "singleLoaded",
  LOAD_ERROR: "loadError",
  IMAGE_LOADED: "imageLoaded",

  _avatar: {
    mode: "2d",
    support3d: true,
    backface: true
  },

  keywordArr: [
    "x",
    "y",
    "z",
    "width",
    "height",
    "color",
    "regX",
    "regY",
    "alpha",
    "rotation",
    "rotationX",
    "rotationY",
    "rotationZ",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skewX",
    "skewY",
    "zIndex",
    "round",
    "radius",
    "radiusX",
    "radiusY",
    "originalWidth",
    "originalHeight"
  ],
  perspective: 500,
  DEFAULT_DEPTH: 100,
  agileObjs: {},
  containers: [],

  getEleById(id) {
    return this.agileObjs[id];
  },

  get keyword() {
    if (!this._avatar.keyword) this._avatar.keyword = "_" + this.keywordArr.join("_") + "_";
    return this._avatar.keyword;
  },

  get transform() {
    if (!this._avatar.transform) this._avatar.transform = this.Css.getPrefix(2) + "transform";
    return this._avatar.transform;
  },

  get transformOrigin() {
    if (!this._avatar.transformOrigin) this._avatar.transformOrigin = this.Css.getPrefix(2) + "transform-origin";
    return this._avatar.transformOrigin;
  },

  get mode() {
    return this._avatar.mode;
  },

  set mode(mode) {
    if (this.support3d) this._avatar.mode = mode;
    else this._avatar.mode = "2d";
  },

  get support3d() {
    if (!this._avatar.support3d) this._avatar.support3d = this.Css.support3d();
    return this._avatar.support3d;
  },

  get backface() {
    return this._avatar.backface;
  },

  set backface(backface) {
    this._avatar.backface = backface;
    for (let key in this.agileObjs) {
      const agile = this.agileObjs[key];
      agile.backface = backface;
    }
  }
};
