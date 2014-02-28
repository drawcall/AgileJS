/*
 * Xccessors Standard: Cross-browser ECMAScript 5 accessors
 * http://purl.eligrey.com/github/Xccessors
 *
 * 2010-06-21
 *
 * By Eli Grey, http://eligrey.com
 *
 * A shim that partially implements Object.defineProperty,
 * Object.getOwnPropertyDescriptor, and Object.defineProperties in browsers that have
 * legacy __(define|lookup)[GS]etter__ support.
 *
 * Licensed under the X11/MIT License
 *   See LICENSE.md
 */

/*jslint white: true, undef: true, plusplus: true,
 bitwise: true, regexp: true, newcap: true, maxlen: 90 */

/*! @source http://purl.eligrey.com/github/Xccessors/blob/master/xccessors-standard.js*/

( function() {
	//"use strict";
		var ObjectProto = Object.prototype, defineGetter = ObjectProto.__defineGetter__, defineSetter = ObjectProto.__defineSetter__, lookupGetter = ObjectProto.__lookupGetter__, lookupSetter = ObjectProto.__lookupSetter__, hasOwnProp = ObjectProto.hasOwnProperty;

		if (defineGetter && defineSetter && lookupGetter && lookupSetter) {

			if (!Object.defineProperty) {
				Object.defineProperty = function(obj, prop, descriptor) {
					if (arguments.length < 3) {// all arguments required
						throw new TypeError("Arguments not optional");
					}

					prop += "";
					// convert prop to string

					if (hasOwnProp.call(descriptor, "value")) {
						if (!lookupGetter.call(obj, prop) && !lookupSetter.call(obj, prop)) {
							// data property defined and no pre-existing accessors
							obj[prop] = descriptor.value;
						}

						if ((hasOwnProp.call(descriptor, "get") || hasOwnProp.call(descriptor, "set"))) {
							// descriptor has a value prop but accessor already exists
							throw new TypeError("Cannot specify an accessor and a value");
						}
					}

					// can't switch off these features in ECMAScript 3
					// so throw a TypeError if any are false
					if (!(descriptor.writable && descriptor.enumerable && descriptor.configurable)) {
						throw new TypeError("This implementation of Object.defineProperty does not support" + " false for configurable, enumerable, or writable.");
					}

					if (descriptor.get) {
						defineGetter.call(obj, prop, descriptor.get);
					}
					if (descriptor.set) {
						defineSetter.call(obj, prop, descriptor.set);
					}

					return obj;
				};
			}

			if (!Object.getOwnPropertyDescriptor) {
				Object.getOwnPropertyDescriptor = function(obj, prop) {
					if (arguments.length < 2) {// all arguments required
						throw new TypeError("Arguments not optional.");
					}

					prop += "";
					// convert prop to string

					var descriptor = {
						configurable : true,
						enumerable : true,
						writable : true
					}, getter = lookupGetter.call(obj, prop), setter = lookupSetter.call(obj, prop);

					if (!hasOwnProp.call(obj, prop)) {
						// property doesn't exist or is inherited
						return descriptor;
					}
					if (!getter && !setter) {// not an accessor so return prop
						descriptor.value = obj[prop];
						return descriptor;
					}

					// there is an accessor, remove descriptor.writable;
					// populate descriptor.get and descriptor.set (IE's behavior)
					delete descriptor.writable;
					descriptor.get = descriptor.set = undefined;

					if (getter) {
						descriptor.get = getter;
					}
					if (setter) {
						descriptor.set = setter;
					}

					return descriptor;
				};
			}

			if (!Object.defineProperties) {
				Object.defineProperties = function(obj, props) {
					var prop;
					for (prop in props) {
						if (hasOwnProp.call(props, prop)) {
							Object.defineProperty(obj, prop, props[prop]);
						}
					}
				};
			}

		}
	}()); 