(function(global, undefined) {
    var fs = global.fs || {};

    global.fs = fs;

    util.merger(fs.canvas, {
        type: 'h5',
        loadHTML: function(array) {
            var me = this;
            util.each(array, function(i, url) {
                array[i] = '<img data-src="' + me.getURL(url) + '"/>';
            })
            document.all.J_pages.innerHTML = array.join('');
        },
        mode: cModeMobile
    });

    fs.canvas.init();
})(window);
