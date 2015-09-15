(function(global, undefined) {
    /*
     *扩展node的util类
     * @authors     wuhao
     * @date        2015-05-27 14:37:16
     * @version     1.0.0
     */
    var util = global.util || {},
        ArrayPrototype = Array.prototype,
        ObjectPrototype = Object.prototype,
        FunctionPrototype = Function.prototype,
        ObjectHasOwnProperty = ObjectPrototype.hasOwnProperty,
        toString = ObjectPrototype.toString,
        ArraySlice = ArrayPrototype.slice,
        emptyFunction = function() {};

    global.util = util;

    function each(array, handle, scope) {
        if (!array || !handle) {
            return;
        }
        if (array.length >= 0) {
            for (var i = 0, size = array.length; i < size; i++) {
                if (scope == null) {
                    scope = array[i];
                }
                if (handle.call(scope, i, array[i], size) === false) {
                    return false;
                }
            }
        }
    };

    function iterator(array, handle, scope) {
        if (!array || !handle) {
            return;
        }
        scope = scope || null;
        for (var key in array) {
            if (scope == null) {
                scope = array[key];
            }
            if (ObjectHasOwnProperty.call(array, key) && handle.call(scope, key, array[key]) === false) {
                return false;
            }
        }
    };

    function mergerAndApply(isApply, isDeep, target, list) {
        each(list, function(index, copy) {
            iterator(copy, function(key, copyItem) {
                var targetItem = target[key];
                if (isApply && targetItem) {

                } else if (isDeep && copyItem && isObject(copyItem) && targetItem) {
                    if (!isObject(targetItem)) {
                        targetItem = {};
                    }
                    target[key] = mergerAndApply(isApply, isDeep, targetItem, [copyItem]);
                } else {
                    target[key] = copyItem;
                }
            });
        });
        return target;
    };


    function getArgs() {
        var args = arguments,
            target,
            isDeep = false,
            index;
        if (args[0] === true || args[0] === false) {
            isDeep = args[0];
            target = args[1] || {};
            index = 2;
        } else {
            target = args[0] || {};
            index = 1;
        }
        return {
            isDeep: isDeep,
            target: target,
            list: ArraySlice.call(args, index)
        };
    };

    function merger(isDeep, target, config1, configN) {
        var arg = getArgs.apply({}, arguments);
        return mergerAndApply(false, arg.isDeep, arg.target, arg.list);
    };

    function apply(isDeep, target, config1, configN) {
        var arg = getArgs.apply({}, arguments);
        return mergerAndApply(true, arg.isDeep, arg.target, arg.list);
    };

    function isEmpty(value) {
        return (value === null) || (value === undefined) || (value === '') || (isArray(value) && value.length === 0);
    };


    var isArray = ('isArray' in Array) ? Array.isArray : function(value) {
        return toString.call(value) === '[object Array]';
    };

    function isDate(value) {
        return toString.call(value) === '[object Date]';
    };

    function isObject(value) {
        return toString.call(value) === '[object Object]';
    };

    function isFunction(value) {
        return typeof value === 'function';
    };

    function isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    };

    function isString(value) {
        return typeof value === 'string';
    };

    function isBoolean(value) {
        return typeof value === 'boolean';
    };

    function isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    };

    function isElement(value) {
        return value ? value.nodeType === 1 : false;
    };

    function isTextNode(value) {
        return value ? value.nodeName === "#text" : false;
    };

    apply(util, {
        each: each,
        it: iterator,
        iterator: iterator,
        merger: merger,
        apply: apply,
        emptyFn: function() {},
        isArray: isArray,
        isEmpty: isEmpty,
        isDate: isDate,
        exec: function(handle, args, scope) {
            if (!handle) {
                return -1;
            }
            scope = scope || global;
            return handle.apply(scope, args || []);
        },
        extend: function(clazz, superClazz, prototype) {
            clazz.prototype = superClazz.prototype;
            clazz.prototype = new clazz();
            merger(clazz.prototype, prototype);
        }
    });

})(window);
