(function(global, undefined) {
    var fs = global.fs || {};

    global.fs = fs;

    util.merger(fs.canvas, {
        type: 'h5',
        loadHTML: function(html) {
            document.all.J_content.innerHTML = html;
        },
        taskFinish: function() {
            console.info('task finish..');
        }
    });

    fs.canvas.init();
})(window);
