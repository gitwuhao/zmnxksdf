(function(global, undefined) {
    var pictureCategory = {
        'handu': '106141122482859956',
        //pictureCategoryId
        'amh': '106141122482910215'
    };
    
    var fs = global.fs;
    global.fs = fs;

    var DIR_MAPING = {};

    DIR_MAPING[fs.KEY.hd] = '106141122482859956';
    DIR_MAPING[fs.KEY.amh] = '106141122482859956';


    fs.gallery = {
        /*
         *{
         *   type: hd,
         *   dir : 'QA1454',
         *   callback: function(item){}
         *}
         */
        addDir: function(config) {
            var dir_id = DIR_MAPING[config.type || fs.KEY.hd];
            $.ajax({
                url: 'http://tadget.taobao.com/redaction/redaction/json.json',
                data: {
                    'cmd': 'json_add_dir',
                    'dir_id': dir_id,
                    'name': config.dir,
                    '_input_charset': 'utf-8'
                },
                dataType: 'text',
                success: this.doAddDirSuccess.bind(this, config),
                error: this.doError.bind(this, config)
            });
        },
        doAddDirSuccess: function(config, data) {
            data = JSON.parse(data);
            if (config.callback) {
                config.callback({
                    id: data.module.pictureCategoryId,
                    dir: config.dir
                });
            }
        },
        doComplete: function() {},
        doError: function() {},
        /*
         *{
         *  dirId : '12313211321',
         *  file : '',
         *  file_name:'',
         *  callback: function(item){}
         *}
         */
        upload: function(config) {
            var me = this,
                xhr;
            xhr = new XMLHttpRequest();

            // 文件上传成功或是失败
            xhr.onreadystatechange = function(e) {
                if (xhr.readyState == 4) {
                    me.doComplete(config);
                    if (xhr.status == 200) {
                        me.doUploadSuccess(config, xhr.responseText);
                    } else {
                        me.doError(config, xhr.responseText);
                    }
                }
            };
            // 开始上传
            xhr.open("POST", 'http://tadget.taobao.com/redaction/redaction/json.json?cmd=json_file_upload&_input_charset=UTF-8&_output_charset=UTF-8&source=tadget', true);

            var formData = new FormData();
            formData.append('pic_file', config.file, encodeURIComponent(config.file_name));
            formData.append('notify', 'null');
            formData.append('privateKey', 'null');
            formData.append('isPublic', 'false');
            formData.append('compressRate', '0.75');
            formData.append('compressMaxWidth', '0');
            formData.append('compress', 'false');
            formData.append('watermark', 'false');
            formData.append('d', '1');
            formData.append('dirId', config.dirId);
            formData.append('upload_m', 'NewFlash');
            formData.append('bizCode', 'tu');

            xhr.send(formData);
        },
        doUploadSuccess: function(config, data) {
            data = JSON.parse(data);
            if (config.callback) {
                var module = data.module;
                config.callback({
                    url: module.fullUrl,
                    picId: module.pictureId
                });
            }
        },
        testUpload: function(data) {
            this.upload({
                dirId: '106141122490019253',
                file: fs.base642Blob(data),
                file_name: 'adfxc',
                callback: function(item) {
                    console.info(item);
                }
            });
        }
    };


})(window);
