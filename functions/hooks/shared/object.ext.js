/* Polyfill for Object.keys
 * from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys */
if (!Object.keys) {
    const keys = (function () {
        'use strict';
        const hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            const result = [];
            let prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());

    Object.defineProperty(Object, 'keys', {
        value: keys
    });
}

/* Polyfill for Object.values
 * from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values */
if (!Object.values) {
    const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
    const concat = Function.bind.call(Function.call, Array.prototype.concat);
    const values = function values(obj) {
        return Object.keys(obj).reduce((v, k) => concat(v, typeof k === 'string' && isEnumerable(obj, k) ? [obj[k]] : []), []);
    };

    Object.defineProperty(Object, 'values', {
        value: values
    });
}
