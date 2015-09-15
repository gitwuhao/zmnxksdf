(function(global, undefined) {
    var fs = global.fs || {};

    global.fs = fs;

    fs.canvas = {
        type: 'pc',
        init: function() {
            window.addEventListener('load', function() {
                chrome.runtime.getBackgroundPage(function(page) {
                    fs.canvas.startup(page);
                });
            });
        },
        getURL: function(url) {
            return url.replace(/^(\/\/)/, 'http://');
        },
        startup: function(page) {
            this.page = page;
            page.fs.page.getDescHTML(window, this.doDescHTML.bind(this));
        },
        doDescHTML: function(html) {
            this.loadHTML(html);
            this.initImageQueue();
        },
        loadHTML: function(html) {
            document.body.innerHTML = html;
        },
        initImageQueue: function() {
            new fs.Task({
                array: $('[data-src],[data-background]'),
                handle: this.taskExecute.bind(this),
                finish: this.taskFinish.bind(this)
            });
        },
        taskExecute: function(elem, callback) {
            var $elem = $(elem);
            var key = 'data-src';
            var src = $elem.attr(key);
            if (!src) {
                key = 'data-background';
                src = $elem.attr(key);
            }

            key = key.replace('data-', '');
            src = this.getURL(src);

            var img = new Image();
            img.onload = function() {
                $elem.attr(key, src);
                callback(img);
            };
            img.src = src;
        },
        taskFinish: function() {
            console.info('task finish..');
            this.runCapture();
        },
        mode: cModePC,
        runCapture: function() {
            getExtension().executeGrabber(cActionEdit, this.mode);
        }
    };

})(window);
