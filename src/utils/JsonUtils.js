(function(Agile, undefined) {
	var JsonUtils = Agile.JsonUtils || {
		object2Json : function(obj) {
			var t = typeof (obj);
			if (t != "object" || obj === null) {
				if (t == "string")
					obj = '' + obj + '';
				return String(obj);
			} else {
				var n, v, json = [], arr = (obj && obj.constructor == Array);
				for (n in obj) {
					v = obj[n];
					t = typeof (v);
					if (t == "string") {
						//v = '"' + v + '"';
					} else {
						if (t == "object" && v !== null) {
							v = JsonUtils.object2Json(v);
						}
					}
					json.push(( arr ? '' : '' + n + ':') + String(v));
				}
				var j = json.join("; ");

				return ( arr ? "[" : "{") + j + ( arr ? "]" : "}");
			}
		},

		object2String : function(obj) {
			var str = '';
			for (var index in obj) {
				str += obj[index] + ', ';
			}
			str = str.substr(0, str.length - 2);
			return str;
		},

		replaceChart : function(json) {
			var reg1 = new RegExp('%:', 'g');
			var reg2 = new RegExp('};', 'g');
			json = json.replace(reg1, '%');
			json = json.replace(reg2, '}');
			return json;
		}
	}

	Agile.JsonUtils = JsonUtils;
})(Agile);
