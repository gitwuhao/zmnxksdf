var nodeURL = 'http://127.0.0.1:8901',
    urls = {
        'node': nodeURL,
        'upload': nodeURL + '/upload/',
        'data': nodeURL + '/data/',
        'detail': 'https://detail.m.tmall.com/item.htm?id=',
        'pcdesc': 'http://hws.m.taobao.com/cache/wdesc/5.0?id=',
        'h5desc': 'http://hws.m.taobao.com/cache/mdesc/5.0?id='
    };
var fsMain = {
    urls: urls,
    'shops': [{
        'id': '58501945',
        'suid': '263817957',
        'name': 'handuyishe',
        items: {

        }
    }, {
        'id': '70986937',
        'suid': '849727411',
        'name': 'amh',
        items: {

        }
    }],
    util: {
        getDataByKey: function(key, array) {
            for (var n = 0, len = array.length; n < len; n++) {
                if (new RegExp(key, 'gi').test(array[n])) {
                    var fn = new Function(array[n] + '; return ' + key + ';');
                    return fn();
                }
            }
        },
        init: function(html) {
            this.doc = document.createElement('div');
            this.doc.innerHTML = html.replace(/(<|<\/)(script|img|object|html|body|head|meta|link|style|iframe|frame|embed|audio|video)/gi, '$1' + this.getTagName('$2')).replace(/\s+data\-src/g, ' src');
        },
        getData: function() {
            var array = this.getTagContext('script');
            if (array.length < 1) {
                return null;
            }
            return {
                detail: this.getDataByKey('_DATA_Detail', array),
                mdskip: this.getDataByKey('_DATA_Mdskip', array)
            };
        },
        getTagName: function(tag) {
            return 'x' + tag + 'x';
        },
        getTagContext: function(tag) {
            var list = this.doc.getElementsByTagName(this.getTagName(tag));
            var array = [];
            for (var n = 0, len = list.length; n < len; n++) {
                var html = list[n].innerHTML;
                if (html.length > 0 && !/^\s+$/.test(html)) {
                    array.push(html);
                }
            }
            return array;
        },
        getMainImageArray: function() {
            var array = [],
                me = this;
            util.each(this.doc.getElementsByClassName('itbox'), function(i, div) {
                var img = div.getElementsByTagName(me.getTagName('img'));
                array.push($(img[0]).attr('src').replace(/\.(jpg|png|gif)_.+/i, '.$1'));
            });
            return array;
        }
    },
    getKey: function(title) {
        var array = (title || '').match(/\w{2}\d{4}/);
        return (array || [])[0];
    },
    getItemId: function(url) {
        var array = (url || '').match(/\d{11,12}/);
        return (array || [])[0];
    },
    initShopData: function() {
        var array = this.shops;
        util.each(this.shops, function(i, shop) {
            $.ajax({
                type: 'POST',
                async: false,
                url: urls.data + 'shop_' + shop.id + '.json',
                dataType: 'text',
                success: function(data) {
                    localStorage[shop.id] = data;
                },
                error: function() {}
            });
        });

        this.initDetail();

    },
    initDetail: function() {
        var me = this;
        var array = [];
        util.each(this.shops, function(i, shop) {
            var data = localStorage[shop.id];
            shop = JSON.parse(data);
            if (!shop) {
                return;
            }
            util.it(shop.items, function(key, value) {
                array.push({
                    id: key,
                    key: value,
                    shopId: shop.id
                });
                return false;
            });
        });

        array.index = 0;
        this.loadDetail(array);
    },
    loadDetail: function(array) {
        var me = this,
            item = array[array.index++];
        if (!item) {
            return;
        }
        this.getDetailJSON(item, function() {
            setTimeout(function() {
                me.loadDetail(array);
            }, 3000);
        });
    },
    getDetailJSON: function(item, handle) {
        var me = this;
        $.ajax({
            cache: false,
            url: urls.detail + item.id,
            dataType: 'text',
            success: function(html) {
                me.doDetailHTML(item, html);
                handle();
            },
            error: function(msg) {

            }
        });
    },
    doDetailHTML: function(item, html) {
        this.util.init(html);
        var list = [];
        var array = this.util.getMainImageArray();
        var mainData = this.util.getData() || {};
        var detail = mainData.detail;
        var mdskip = mainData.mdskip;
        var key = item.key;
        var shopId = item.shopId;
        var id = item.id;

        list.push({
            id: key,
            shop: shopId,
            filename: id + '_detail.json',
            dir: '',
            data: JSON.stringify(detail)
        });


        list.push({
            id: key,
            shop: shopId,
            filename: id + '_mdskip.json',
            dir: '',
            data: JSON.stringify(mdskip)
        });

        list.push({
            id: key,
            shop: shopId,
            filename: id + '_images.json',
            dir: '',
            data: JSON.stringify(array)
        });

        util.each(list, function(i, data) {
            $.ajax({
                type: 'POST',
                async: false,
                url: urls.upload,
                data: data,
                success: function() {},
                error: function() {}
            });
        });
    },
    getShopList: function(index, page, sort) {
        var me = this;
        var shop = this.shops[index],
            url = 'https://' + shop.name + '.m.tmall.com/shop/shop_auction_search.do',
            data = {
                index: index,
                spm: 'a320p.7692171.0.0',
                suid: shop.suid,
                sort: sort || 'hotsell',
                p: page || 1,
                page_size: 12,
                from: 'h5',
                shop_id: shop.id,
                ajson: 1,
                source: 'tmallsearch'
            };

        $.ajax({
            url: url,
            dataType: 'jsonp',
            data: data,
            success: function(json) {
                me.doItemListJson(json, data);
            },
            error: function(msg) {

            }
        });
    },
    doItemListJson: function(json, data) {
        var me = this;
        var shop = this.shops[data.index];
        if (json.items) {
            util.each(json.items, function(i, item) {
                shop.items[item.item_id] = me.getKey(item.title);
            });

            if (json.items.length == json.page_size) {
                setTimeout(function() {
                    me.getShopList(data.index, data.p + 1, data.sort);
                }, 3000);
            } else {
                localStorage[shop.id] = JSON.stringify(shop);
            }
        }
    }
};





var data = {
    'upload': 'http://127.0.0.1:8901',
    'detail': 'https://detail.m.tmall.com/item.htm?id=',
    'pcdesc': 'http://hws.m.taobao.com/cache/wdesc/5.0?id=',
    'h5desc': 'http://hws.m.taobao.com/cache/mdesc/5.0?id=',
    'search': {
        'callback': '_DLP_2384_01945_ajson_1_source_tmallsearch',
        'spm': 'a320p.7692171.0.0',
        'suid': '263817957',
        //排序default、hotsell、oldstarts、_bid（高）、bid（低）
        'sort': 'oldstarts',
        //页码
        'p': '1',
        //页数
        'page_size': '12',
        'from': 'h5',
        'shop_id': '58501945',
        'ajson': '1',
        'source': 'tmallsearch',
    },
    'domain': {
        'handuyishe': '263817957',
        'amh': '70986937'
    },
    'items': [
        '18959526273', '520726911961', '520830061103'
    ],
    'shopsearch': ['https://amh.m.tmall.com/shop/shop_auction_search.do?callback=_DLP_2384_86937_ajson_1_source_tmallsearch&spm=a222m.7628550.1998338747.1&sort=default&p=1&page_size=12&from=h5&shop_id=70986937&ajson=1&source=tmallsearch', 'https://handuyishe.m.tmall.com/shop/shop_auction_search.do?callback=_DLP_2384_01945_ajson_1_source_tmallsearch&spm=a320p.7692171.0.0&suid=263817957&sort=default&p=1&page_size=12&from=h5&shop_id=58501945&ajson=1&source=tmallsearch'],
    'seach': 'https://handuyishe.m.tmall.com/shop/shop_auction_search.do?callback=_DLP_2384_01945_ajson_1_source_tmallsearch&sort=default&p=2&page_size=12&from=h5&shop_id=58501945&ajson=1&source=tmallsearch'
};
