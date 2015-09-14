var fsPlugin = {
    defaultImageFormat: "jpg",
    port: undefined,
    inited: false,
    captures: undefined,

    init: function() {
        this.inited = true;
    },

    launchFunction: function(cmd, obj) {
        if (cmd == "captureInit") this.captureInit(obj);
        else if (cmd == "captureTabPNG") this.captureTabPNG(obj);
        else if (cmd == "captureDone") this.loadImages(obj, this.captureDone);
    },

    captureInit: function(data) {
        this.captures = [];
        this.imagesLoaded = 0;
    },

    captureTabPNG: function(data) {
        this.captures.push(data);
    },

    loadImages: function(data, callback) {
        var cntr;
        var imagesPending = this.captures.length;

        for (cntr = 0; cntr < this.captures.length; ++cntr) {
            var img = new Image,
                captures = this.captures;

            img.onload = function(id, img) {
                return function() {
                    captures[id].dataurl = "";
                    captures[id].img = img;

                    fsPlugin.clipCapture(data, captures[id]);
                    if (--imagesPending == 0)
                        fsPlugin.captureDone(data);
                }
            }(cntr, img);

            img.src = captures[cntr].dataurl;
        }
    },
    clipCapture: function(data, capture) {
        var canvas = document.createElement('canvas');
        canvas.width = data.cw;
        canvas.height = data.ch;
        var img = capture.img;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        capture.data = canvas.toDataURL(fsPlugin.defaultImageFormat === "png" ? "image/png" : "image/jpeg");

        logToConsole(capture.data);

    },

    captureDone: function(data) {

        chrome.tabs.create({
            url: "fsCaptured.html"
        });

    },
    captureDone2: function(data) {

        var wszURL = data.url,
            wszTitle = data.title,
            wszKey = data.key,

            nChromeVer = data.browserVersion,
            nSBWidth = (nChromeVer > 31 ? 15 : 16),

            nAction = data.action,
            fHorzSB = data.hScrollBar,
            fVertSB = data.vScrollBar,
            nLeft = data.left,
            nTop = data.top,
            nWidth = data.width,
            nHeight = data.height,
            nZoomx100 = data.zoom,
            nClientWidth = data.cw,
            nClientHeight = data.ch,
            nRows = data.rows,
            nCols = data.cols,
            fCrop = data.crop,
            fForced = data.forced,
            fDiv = data.div,
            nCropLeft = data.cropLeft || 0,
            nCropTop = data.cropTop || 0,
            nCropRight = data.cropRight || 0,
            nCropBottom = data.cropBottom || 0,
            nShiftX = 0,
            nShiftY = 0;

        nLeft = nLeft * nZoomx100 / 100;
        nTop = nTop * nZoomx100 / 100;

        this.pBitmapForChrome = document.createElement('canvas');

        var cntr;
        for (cntr = 0; cntr < this.captures.length; ++cntr) {

            var nSliceX = this.captures[cntr].x,
                nSliceY = this.captures[cntr].y,
                pObject = this.captures[cntr].img;


            if (cntr == 0) {
                nShiftX = nSliceX;
                nShiftY = nSliceY;


                var fZoom = nZoomx100 != 100;
                var nRealClientWidth = pObject.width + (fVertSB ? -nSBWidth : 0);
                var nRealClientHeight = pObject.height + (fHorzSB ? -nSBWidth : 0);

                if (fZoom || fForced) {
                    if (nRows == 1 && nCols == 1 && !fCrop) {
                        nWidth = nRealClientWidth;
                        nHeight = nRealClientHeight;
                    } else {
                        nWidth = nWidth * nZoomx100 / 100;
                        nHeight = nHeight * nZoomx100 / 100;
                    }

                    if (fCrop) {
                        nWidth = nWidth * nRealClientWidth / nClientWidth;
                        nHeight = nHeight * nRealClientHeight / nClientHeight;

                        nCropLeft = nCropLeft * nRealClientWidth / nClientWidth;
                        nCropRight = nCropRight * nRealClientWidth / nClientWidth;

                        nCropTop = nCropTop * nRealClientHeight / nClientHeight;
                        nCropBottom = nCropBottom * nRealClientHeight / nClientHeight;
                    }

                    if (fDiv) {
                        nClientWidth = nClientWidth * nZoomx100 / 100;
                        nClientHeight = nClientHeight * nZoomx100 / 100;
                    } else {
                        nClientHeight = nRealClientHeight;
                        nClientWidth = nRealClientWidth;
                    }
                }

                this.pBitmapForChrome.width = Math.max(1, (fCrop ? nCropRight - nCropLeft : nWidth));
                this.pBitmapForChrome.height = Math.max(1, (fCrop ? nCropBottom - nCropTop : nHeight));
            }

            var nX = (nSliceX - nShiftX) * nZoomx100 / 100;
            var nY = (nSliceY - nShiftY) * nZoomx100 / 100;

            var ctx = this.pBitmapForChrome.getContext('2d');
            ctx.drawImage(pObject, nX - nCropLeft, nY - nCropTop);
        }

        /*var ctx = this.pBitmapForChrome.getContext('2d');
		
		ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (10, 10, 55, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);*/

        //chrome.tabs.create({url: this.pBitmapForChrome.toDataURL()});
        /*var link = document.createElement('a');
        link.download = "test.png";
        link.href = this.pBitmapForChrome.toDataURL("image/png").replace("image/png", "image/octet-stream");
        link.click();*/
        capResult = this.pBitmapForChrome;
        capResultDataURL = this.pBitmapForChrome.toDataURL(getOption(cDefaultImageFormatPref, "png") === "png" ? "image/png" : "image/jpeg");
        capResultFileNameLite = getFilenameLite();

        // chrome.tabs.create({url: "fsCaptured.html"});


        //alert(this.pBitmapForChrome.toDataURL());
    }
}

function getJSPlugin() {
    if (!fsPlugin.inited)
        fsPlugin.init();

    return fsPlugin;
}

function getKey(title) {
    var key = (title || '').match(/\w{2}\d{4}/);
    return key;
};

function getItemId(url) {
    var id = (url || '').match(/\d{11}/);
    return id;
};

var url = {
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
    'shopsearch': ['https://amh.m.tmall.com/shop/shop_auction_search.do?callback=_DLP_2384_86937_ajson_1_source_tmallsearch&spm=a222m.7628550.1998338747.1&sort=default&p=1&page_size=12&from=h5&shop_id=70986937&ajson=1&source=tmallsearch', 'https://handuyishe.m.tmall.com/shop/shop_auction_search.do?callback=_DLP_2384_01945_ajson_1_source_tmallsearch&spm=a320p.7692171.0.0&suid=263817957&sort=default&p=1&page_size=12&from=h5&shop_id=58501945&ajson=1&source=tmallsearch'],
    'seach': 'https://handuyishe.m.tmall.com/shop/shop_auction_search.do?callback=_DLP_2384_01945_ajson_1_source_tmallsearch&sort=default&p=2&page_size=12&from=h5&shop_id=58501945&ajson=1&source=tmallsearch'
};
