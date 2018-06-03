const IDCache = {};

export default {

	generateID(name) {
		if (!IDCache[name]) IDCache[name] = 0;
		return name + '_' + (IDCache[name]++);
	}
}