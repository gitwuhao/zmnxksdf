(function(global, undefined) {
    var fs = global.fs || {};

    global.fs = fs;

    util.merger(fs.canvas, {
        type: 'pc',
        loadHTML: function(html) {
            document.all.J_content.innerHTML = html;
            $('.rmsp').remove();
        },
        mode: cModePC
    });

    fs.canvas.init();
})(window);
