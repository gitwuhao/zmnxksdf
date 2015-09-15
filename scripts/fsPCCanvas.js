(function(global, undefined) {
    var fs = global.fs || {};

    global.fs = fs;

    util.merger(fs.canvas, {
        type: 'pc',
        loadHTML: function(html) {
            document.all.J_content.innerHTML = html;
        },
        mode: cModePC
    });

    fs.canvas.init();
})(window);
