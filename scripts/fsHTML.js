(function(global, undefined) {
    var fs = global.fs || {},
        tagArray = 'img|object|html|body|head|meta|link|style|iframe|frame|embed|audio|video',
        tagPrefix = 'xxx';

    global.fs = fs;

    fs.html = function(config) {
        this.init.apply(this, arguments);
    };

    function getTagName(tag) {
        if (tag == 'script') {
            return 'script';
        }
        return tagPrefix + tag + tagPrefix;
    };

    util.merger(fs.html, {
        encodeReg: new RegExp('(<|<\\\/)(' + tagArray + ')', 'gi'),
        decodeReg: new RegExp('(<|<\\\/)' + tagPrefix + '(' + tagArray + ')' + tagPrefix, 'gi'),
        encodeHTML: function(html) {
            return html.replace(this.encodeReg, '$1' + getTagName('$2'))
                .replace(/\s+(src\s?=|background\s?=)/ig, ' data-$1');
        },
        decodeHTML: function(html) {
            return html.replace(this.decodeReg, '$1$2');
        }
    });

    util.merger(fs.html.prototype, {
        init: function(html) {
            this.doc = document.createElement('div');
            if (html) {
                this.doc.innerHTML = fs.html.encodeHTML(html);
            }
        },
        getDataByKey: function(key, array) {
            for (var n = 0, len = array.length; n < len; n++) {
                if (new RegExp(key, 'gi').test(array[n])) {
                    var fn = new Function(array[n] + '; return ' + key + ';');
                    return fn();
                }
            }
        },
        getTagName: getTagName,
        getTagContext: function(tag) {
            var list = this.doc.getElementsByTagName(this.getTagName(tag));
            var array = [];
            for (var n = 0, len = list.length; n < len; n++) {
                var html = list[n].innerHTML;
                if (html.length > 0 && !/^\s+$/.test(html)) {
                    array.push(html);
                }
            }
            return array;
        }
    });
})(window);
