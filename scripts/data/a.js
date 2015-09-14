var AM = {
    data: {
        detail: {},
        mdskip: {}
    },
    getDataByKey: function(key, array) {
        for (var n = 0, len = array.length; n < len; n++) {
            if (new RegExp(key, 'gi').test(array[n])) {
                var fn = new Function(array[n] + '; return ' + key + ';');
                return fn();
            }
        }
    },
    getData: function(html) {
        var array = this.getTagContext('script', html);
        if (array.length < 1) {
            return null;
        }
        var data = this.data;
        data.detail = this.getDataByKey('_DATA_Detail', array);
        data.mdskip = this.getDataByKey('_DATA_Mdskip', array);
    },
    getTagContext: function(tag, context) {
        var div = document.createElement('div');
        div.innerHTML = context.replace(/(script|img|object|html|body|head|meta|link|style|iframe|frame|embed|audio|video)/gi, 'x$1x');
        var list = div.getElementsByTagName('x' + tag + 'x');
        var array = [];
        for (var n = 0, len = list.length; n < len; n++) {
            var html = list[n].innerHTML;
            if (html.length > 0 && !/^\s+$/.test(html)) {
                array.push(html);
            }
        }
        return array;
    }
};
AM.getData(document.body.innerHTML);







var list = html.match(/<script.+<\/script>/gi);

var data = {
    detail: {},
    mdskip: {}
};

var handles = {
    /_DATA_Detail/: function(script) {

    },
    /_DATA_Mdskip/: function(script) {

    }
};

util.each(function(i, script) {
    util.it(handles, function(key, handle) {
        handle(script);
    });
});


(function() {


    var TagHandle = {
        indexOf: function(tag, start) {
            var len = tag.length,
                html = this.context;
            if (html.length < start + len) {
                return -1;
            }
            for (var n = 0; n < len; n++) {
                if (tag[n] != html.charAt(start + n).toLowerCase()) {
                    return -1;
                }
            }
            return len;
        },
        find: function(i) {
            var c = '',
                i = 0,
                start = 0,
                html = this.context;
            while ((c = html.charAt(i++)) != '') {
                if (this.indexOf(this.startTag, html, i + 1) > -1) {
                    start = i;
                    i += tag.length;
                } else if (this.indexOf(this.endTag, html, i + 1) > -1) {
                    i += tag.length;
                }
            }
        }
    };






})();
