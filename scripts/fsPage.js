(function(global, undefined) {
    var fs = global.fs || {};

    global.fs = fs;

    fs.page = {
        PC_TYPE: 'pc',
        H5_TYPE: 'h5',
        error: {
            id: "40023114821",
            key: "LF4002",
            shopId: "58501945"
        },
        init: function() {
            this.type = this.PC_TYPE;
            fsMain.getShopData(this.loadData.bind(this));
            setInterval(this.pushLocalStorage.bind(this), 3 * 60 * 1000);
        },
        loadLS: function() {
            this.type = this.PC_TYPE;
            var data = localStorage['items_map'];
            this.itemsMap = JSON.parse(data);
            this.createTab();
            setInterval(this.pushLocalStorage.bind(this), 3 * 60 * 1000);
        },
        loadData: function(shops) {
            var me = this,
                map = {};
            util.each(shops, function(i, shop) {
                var data = localStorage[shop.id];
                shop = JSON.parse(data);
                if (!shop) {
                    return;
                }
                util.it(shop.items, function(key, value) {
                    map[key] = {
                        id: key,
                        key: value,
                        shopId: shop.id
                    };
                    // return false;
                });
            });
            this.itemsMap = map;
            this.createTab();
        },
        createTab: function() {
            var type = this.type,
                me = this,
                url = 'fsPCCanvas.html';
            if (type == this.H5_TYPE) {
                url = 'fsH5Canvas.html';
            }

            chrome.tabs.create({
                url: url
            }, function(tab) {
                me.activeTab = tab;
            });
        },
        getDescHTML: function(win, handle) {
            var item;
            util.it(this.itemsMap, function(key, value) {
                item = value;
                return false;
            });
            if (!item) {
                return;
            }
            this.activeWin = win;
            this.activeItem = item;
            if (this.type == this.H5_TYPE) {
                this.getH5DescHTML(item.id, handle);
            } else {
                this.getPCDescHTML(item.id, handle);
            }
        },
        getPCDescHTML: function(id, handle) {
            var me = this;
            $.ajax({
                cache: false,
                url: fs.urls.pcdesc + id,
                dataType: 'text',
                success: function(html) {
                    me.doPCDescHTML(id, html, handle);
                },
                error: function(msg) {

                }
            });
        },
        getPCDesc: function(fsHTML) {
            var array = fsHTML.getTagContext('script');
            if (array.length < 1) {
                return null;
            }
            return fsHTML.getDataByKey('wdescData', array);
        },
        doPCDescHTML: function(id, html, handle) {
            var fsHTML = new fs.html(html);
            var data = this.getPCDesc(fsHTML);
            var html = data.tfsContent;
            html = fs.html.decodeHTML(html);
            if (handle) {
                handle(html);
            }
            return html;
        },
        getH5DescHTML: function(id, handle) {
            var me = this;
            $.ajax({
                cache: false,
                url: fs.urls.h5desc + id,
                dataType: 'text',
                success: function(html) {
                    me.doH5DescHTML(id, html, handle);
                },
                error: function(msg) {

                }
            });
        },
        getH5Desc: function(fsHTML) {
            var array = fsHTML.getTagContext('script');
            if (array.length < 1) {
                return null;
            }
            return fsHTML.getDataByKey('wdescData', array);
        },
        doH5DescHTML: function(id, html, handle) {
            var fsHTML = new fs.html(html);
            var data = this.getH5Desc(fsHTML);
            var html = data.wdescContent.pages.join('');
            fsHTML = new fs.html(html);
            var array = fsHTML.getTagContext('img');
            html = array.join('');
            if (handle) {
                handle(array);
            }
            return html;
        },
        captureDone: function(captures) {
            var me = this;
            var item = this.activeItem;
            new fs.AjaxTask({
                array: captures,
                _index_: 0,
                getAjaxcfg: function(capture) {
                    return {
                        type: 'POST',
                        url: fs.urls.upload,
                        data: {
                            id: item.key,
                            shop: item.shopId,
                            filename: item.id + '_' + (++this._index_) + '.png',
                            dir: '',
                            data: capture.data
                        }
                    };
                },
                handle: function(capture, data) {

                },
                finish: function() {
                    me.finishCapture();
                }
            });
        },
        finishCapture: function() {
            delete this.itemsMap[this.activeItem.id];
            this.activeWin.location.reload();
        },
        pushLocalStorage: function() {
            var data = JSON.stringify(this.itemsMap);
            localStorage['items_map'] = data;
            $.ajax({
                type: 'POST',
                url: fs.urls.upload,
                data: {
                    filename: 'items_map.json',
                    dir: '',
                    data: data
                },
                success: function(data) {},
                error: function() {}
            });
        }
    };


})(window);