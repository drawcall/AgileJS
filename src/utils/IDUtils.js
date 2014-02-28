(function(Agile, undefined) {
	var IDUtils = Agile.IDUtils || {
		_idhash : {},
		getID : function(name) {
			if (!this._idhash[name])
				this._idhash[name] = 0;
			return name + '_' + (this._idhash[name]++);
		}
	}

	Agile.IDUtils = IDUtils;
})(Agile);
