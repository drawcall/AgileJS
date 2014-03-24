(function(window, document) {
    var Agile = window.Agile || {
        _avatar: {
            mode: '2d',
            support3d: true,
            backface: true
        },
        keywordArr: ['x', 'y', 'z', 'width', 'height', 'color', 'regX', 'regY', 'alpha', 'rotation', 'rotationX', 'rotationY', 'rotationZ', 'scaleX', 'scaleY', 'scaleZ', 'skewX', 'skewY', 'zIndex','round','radius','radiusX','radiusY', 'originalWidth', 'originalHeight'],
        perspective: 500,
        defaultDepth: 100,
        agileObjs: {},
        containers: [],
        getAgileByID: function(id) {
            return Agile.agileObjs[id];
        },
        get keyword() {
            if (!Agile._avatar.keyword) Agile._avatar.keyword = '_' + Agile.keywordArr.join('_') + '_';
            return Agile._avatar.keyword;
        },
        get transform() {
            if (!Agile._avatar.transform) Agile._avatar.transform = Agile.Css.getPrefix(2) + 'transform';
            return Agile._avatar.transform;
        },
        get transformOrigin() {
            if (!Agile._avatar.transformOrigin) Agile._avatar.transformOrigin = Agile.Css.getPrefix(2) + 'transform-origin';
            return Agile._avatar.transformOrigin;
        },
        get mode() {
            return this._avatar.mode;
        },
        set mode(mode) {
        	if(this.support3d)
            	this._avatar.mode = mode;
            else
            	this._avatar.mode = '2d';
        },
        get support3d(){
        	if(this._avatar.support3d)
        		return this._avatar.support3d;
        	else 
        		return this._avatar.support3d = Agile.Css.support3d();
        },
        get backface() {
        	return this._avatar.backface;
        },
        set backface(backface) {
        	this._avatar.backface = backface;
        	for(var agile in Agile.agileObjs)
        	{
        		agile.backface = backface;
        	}
        }
    }

    Agile.GROUP_LOADED = 'groupLoaded';
    Agile.SINGLE_LOADED = 'singleLoaded';
    Agile.LOAD_ERROR = 'loadError';
    Agile.IMAGE_LOADED = 'imageLoaded';
	Agile.getAgileById = Agile.getAgileByID;
	
    window.Agile = Agile;
})(window, document);