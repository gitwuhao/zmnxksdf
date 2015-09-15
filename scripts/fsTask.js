(function(global, undefined) {
    /*
    *{
        array:[],
        timeout:300,
        autoRun : true,
        handle:function(callback){
        
        }
    }
    */
    var fs = global.fs || {};

    global.fs = fs;

    fs.Task = function(config) {
        if (util.isInitPrototype(config)) {
            return;
        }
        this.init.apply(this, arguments);
    };

    util.merger(fs.Task.prototype, {
        index: 0,
        autoRun: true,
        init: function(config) {
            util.merger(this, config);
            if (this.autoRun) {
                this.next();
            }
        },
        next: function() {
            var task = this.get();
            if (task) {
                this.execute(task);
            }
        },
        get: function() {
            var task = this.array[this.index++];
            if (!task) {
                this.finish();
            }
            return task;
        },
        execute: function(task) {
            var me = this;
            this.handle(task, function() {
                me.complete(task);
            });
        },
        complete: function(task) {
            setTimeout(this.next.bind(this), this.timeout);
        },
        finish: function() {

        }
    });



    fs.AjaxTask = function(config) {
        if (util.isInitPrototype(config)) {
            return;
        }
        this.init.apply(this, arguments);
    };

    util.extend(fs.AjaxTask, fs.Task, {
        index: 0,
        autoRun: true,
        init: function(config) {
            util.merger(this, config);
            if (this.autoRun) {
                this.next();
            }
        },
        next: function() {
            var task = this.get();
            if (task) {
                this.execute(task);
            }
        },
        get: function() {
            var task = this.array[this.index++];
            if (!task) {
                this.finish();
            }
            return task;
        },
        getAjaxcfg: function(task) {
            return task;
        },
        execute: function(task) {
            var me = this,
                config = this.getAjaxcfg(task);
            $.ajax(util.merger({
                success: function(data) {
                    me.handle(task, data);
                    me.complete(task);
                },
                error: function() {}
            }, config));
        },
        complete: function(task) {
            setTimeout(this.next.bind(this), this.timeout);
        },
        finish: function() {

        }
    });

    fs.localStorageTask = function(config) {
        if (util.isInitPrototype(config)) {
            return;
        }
        this.init.apply(this, arguments);
    };

    util.extend(fs.localStorageTask, fs.Task, {
        id: 'my_task',
        LS: localStorage,
        get: function() {
            var task;
            this.index++;
            util.it(this.map, function(key, value) {
                task = {
                    key: key,
                    value: value
                };
                return false;
            });
            if (!task) {
                delete this.LS[this.id];
            }
            return task;
        },
        complete: function(task) {
            setTimeout(this.next.bind(this), this.timeout);
            var key = task.key;
            delete this.map[key];
            if ((this.index + 1) % 10 == 0) {
                this.pushStorage();
            }
        },
        pushStorage: function() {
            this.LS[this.id] = JSON.stringify(this.map);
        }
    });
})(window);
