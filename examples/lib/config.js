var configArr = [];
var configObj = {
	baseUrl : "../../src/",
};
var shim = {};
var paths = {
	"domReady" : "../test/lib/domReady",
	"Agile" : "core/Agile",
	"Css" : "core/Css",
	
	"Filter" : "filter/Filter",
	
	"IDUtils" : "utils/IDUtils",
	"JsonUtils" : "utils/JsonUtils",
	"Utils" : "utils/Utils",
	"Color" : "utils/Color",
	"LoadManager" : "utils/LoadManager",
	"xccessors" : "utils/xccessors",
	"requestAnimationFrame" : "utils/requestAnimationFrame",
	
	"EventDispatcher" : "event/EventDispatcher",
	"DisplayObject" : "display/DisplayObject",
	"Rect" : "display/Rect",
	"Circle" : "display/Circle",
	"Ellipse" : "display/Ellipse",
	"Triangle" : "display/Triangle",
	"Image" : "display/Image",
	"Line" : "display/Line",
	"Text" : "display/Text",
	"MovieClip" : "display/MovieClip",
	"Dom" : "display/Dom",
	"Container" : "display/Container",
	
	"Avatar" : "animate/Avatar",
	"Tween" : "animate/Tween",
	"Timeline" : "animate/Timeline",
	"Keyframes" : "animate/Keyframes",
	"MovieClipLabel" : "animate/MovieClipLabel",
	"ease" : "animate/ease",

	"Semicircle" : "extras/Semicircle",
	"ScrollingBg" : "extras/ScrollingBg",

	"agile_toolkit" : "../plus/agile_toolkit"
}

for (var index in paths) {
	configArr.push(index);

	//Agile
	if (index == "Agile") {
		shim[index] = {
			exports : "Agile"
		};
	}
	//filter
	else if (index == "Filter") {
		shim[index] = {
			deps : ["Agile", "Text", "Css"]
		};
	}
	//utils
	else if (index == "Utils") {
		shim[index] = {
			deps : ["Agile", "xccessors"]
		};
	} else if (index == "LoadManager") {
		shim[index] = {
			deps : ["Agile", 'xccessors', "EventDispatcher"]
		};
	}
	//animate
	else if (index == "Avatar") {
		shim[index] = {
			deps : ["DisplayObject"]
		};
	} else if (index == "Tween") {
		shim[index] = {
			deps : ["Agile", "Css"]
		};
	} else if (index == "Timeline") {
		shim[index] = {
			deps : ["Avatar", "Tween"]
		};
	} else if (index == "Keyframes") {
		shim[index] = {
			deps : ["Agile", "Timeline"]
		};
	}
	//display
	else if (index == "DisplayObject") {
		shim[index] = {
			deps : ["Utils", "IDUtils"]
		};
	} else if (index == "Circle") {
		shim[index] = {
			deps : ["DisplayObject"]
		};
	} else if (index == "Ellipse") {
		shim[index] = {
			deps : ["DisplayObject"]
		};
	} else if (index == "Rect") {
		shim[index] = {
			deps : ["DisplayObject"]
		};
	} else if (index == "Triangle") {
		shim[index] = {
			deps : ["DisplayObject"]
		};
	} else if (index == "Image") {
		shim[index] = {
			deps : ["DisplayObject"]
		};
	} else if (index == "Text") {
		shim[index] = {
			deps : ["DisplayObject"]
		};
	} else if (index == "Line") {
		shim[index] = {
			deps : ["DisplayObject"]
		};
	} else if (index == "MovieClip") {
		shim[index] = {
			deps : ["Image"]
		};
	} else if (index == "Dom") {
		shim[index] = {
			deps : ["DisplayObject"]
		};
	} else if (index == "Container") {
		shim[index] = {
			deps : ["Dom"]
		};
	}
	//extras
	else if (index == "Semicircle") {
		shim[index] = {
			deps : ["DisplayObject"]
		};
	} else if (index == "ScrollingBg") {
		shim[index] = {
			deps : ["Image"]
		};
	} else if (index == "agile_toolkit") {
		//xccessors\all-plugs
		shim[index] = {
			deps : ["Agile","DisplayObject"]
		};
	}
	//other
	else {
		//xccessors\all-plugs
		shim[index] = {
			deps : ["Agile"]
		};
	}
}

configObj.paths = paths;
configObj.shim = shim;
configObj.out = '';
require.config(configObj);
require(configArr, function(domReady, Agile) {
	domReady(function() {
		Main(Agile);
	});
});
