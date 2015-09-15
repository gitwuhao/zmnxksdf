(function(global, undefined) {
    /*
    *{
        id: 'my_task',
    	array:[],
    	timeout:300,
    	handle:function(callback){
    	
    	}
    }
    */
    var fs = global.fs || {};

    global.fs = fs;

    fs.Task = function(config) {
        this.init.apply(this, arguments);
    };

    util.merger(fs.Task.prototype, {
        id: 'my_task',
        index: 0,
        init: function(config) {
            util.merger(this, config);
        },
        next: function() {
            var task = this.get();
            if (task) {
                this.execute(task);
            }
        },
        get: function() {
            return this.array[this.index++];
        },
        execute: function(task) {
            var me = this;
            this.currentTask = task;
            this.handle(function() {
                me.complete(task);
            });
        },
        complete: function(task) {
            setTimeout(this.next.bind(this), this.timeout);
        },
        finish: function() {

        }
    });

    fs.localStorageTask = function(config) {
        this.init.apply(this, arguments);
    };

    util.extend(fs.localStorageTask, fs.Task, {
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
