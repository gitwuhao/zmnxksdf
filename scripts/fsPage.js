(function(global, undefined) {
    var fs = global.fs || {};

    global.fs = fs;

    fs.page = {
        PC_TYPE: 'pc',
        H5_TYPE: 'h5',
        init: function(type) {
            fsMain.getShopData(this.loadData.bind(this));
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
                    return false;
                });
            });
            this.itemsMap = map;
            this.createTab(this.H5_TYPE);
        },
        createTab: function(type) {
            var url = 'fsPCCanvas.html';
            if (type == this.H5_TYPE) {
                url = 'fsH5Canvas.html';
            }
            this.type = type;
            chrome.tabs.create({
                url: url
            });
        },
        getDescHTML: function(handle) {
            var item;
            util.it(this.itemsMap, function(key, value) {
                item = value;
                return false;
            });
            if (!item) {
                return;
            }
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
                url: urls.pcdesc + id,
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
                url: urls.h5desc + id,
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
        }
    };

})(window);
