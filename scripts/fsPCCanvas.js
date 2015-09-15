(function(global, undefined) {
    var fs = global.fs || {};

    global.fs = fs;

    util.merger(fs.canvas, {
        type: 'pc',
        loadHTML: function(html) {
            document.all.J_pages.innerHTML = html;
        },
        taskFinish: function() {
            console.info('task finish..');
        }
    });

    fs.canvas.init();
})(window);
