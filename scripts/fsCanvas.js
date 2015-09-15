(function(global, undefined) {
    var fs = global.fs || {};

    global.fs = fs;

    fs.canvas = function(config) {
        if (util.isInitPrototype(config)) {
            return;
        }
        this.init.apply(this, arguments);
    };

    util.merger(fs.canvas.prototype, {
        type: 'pc',
        init: function(page) {
            var task = page.fs.page.getTask(this.type);
            document.body.innerHTML = task.html;
            this.initImageQueue();
        },
        initImageQueue: function() {
            new fs.Task({
                array: $('[data-src],[data-background]'),
                timeout: 300,
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
            src = src.replace(/^(\/\/)/, 'http://');

            var img = new Image();
            img.onload = function() {
                $elem.attr(key, src);
                callback(img);
            };
            img.src = src;
        },
        taskFinish: function() {
            console.info('task finish..');
        }
    });


    window.addEventListener('load', function() {
        chrome.runtime.getBackgroundPage(function(page) {
            new fs.canvas(page);
        });
    });
})(window);
