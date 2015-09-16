
    var urls = {
        'upload': {
            //https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
            url: 'http://tadget.taobao.com/redaction/redaction/json.json?cmd=json_file_upload&_input_charset=UTF-8&_output_charset=UTF-8&source=tadget',
            data: {
                'pic_file': '图片.png',
                'notify': 'null',
                'privateKey': 'null',
                'isPublic': 'false',
                'compressRate': '0.75',
                'compressMaxWidth': '0',
                'compress': 'false',
                'watermark': 'false',
                'd': '1',
                'dirId': '目录',
                'upload_m': 'NewFlash',
                'bizCode': 'tu'
            },
            result: {
                "success": true,
                "message": "",
                "module": {
                    "pictureId": "106140122544349451",
                    "pictureCategoryId": "106141122490019253",
                    "picturePath": "i4/346360614/TB2.SVrfpXXXXb1XpXXXXXXXXXX_!!346360614.jpg",
                    "name": "41hnO8lpjCL",
                    "sizes": 32483,
                    "sellerId": "346360614",
                    "deleted": 0,
                    "status": 0,
                    "gmtCreate": 1442386353536,
                    "gmtModified": 1442386353536,
                    "pixel": "500x279",
                    "md5": "",
                    "options": 0,
                    "genShortURL": null,
                    "featuresMap": {
                        "source": "tadget,MD5,"
                    },
                    "optionMap": {
                        "source": "tadget,MD5,"
                    },
                    "fullUrl": "https://img.alicdn.com/imgextra/i4/346360614/TB2.SVrfpXXXXb1XpXXXXXXXXXX_!!346360614.jpg",
                    "picDomainOption": null,
                    "frezonMessage": null,
                    "pictureCategoryName": null,
                    "clientType": 0,
                    "fileType": 1,
                    "spaceId": 0,
                    "mountSpaceId": null,
                    "from": "pic",
                    "pictureVersion": null,
                    "sellerNick": null
                },
                "crsToken": "diN1l0InMZDBva2",
                "errorCode": null,
                "errorMessage": null,
                "jsonData": {
                    "fileId": "106140122544349451",
                    "gmtCreate": 1442386353535,
                    "gmtModified": 1442386353535,
                    "url": "https://img.alicdn.com/imgextra/i4/346360614/TB2.SVrfpXXXXb1XpXXXXXXXXXX_!!346360614.jpg",
                    "name": "41hnO8lpjCL",
                    "size": 32483
                }
            }
        },
        'addCategory': {
            url: 'http://tadget.taobao.com/redaction/redaction/json.json',
            data: {
                'cmd': 'json_add_dir',
                'dir_id': '106141122482859956',
                'name': 'aad',
                '_input_charset': 'utf-8'
            },
            result: {
                "success": true,
                "message": null,
                "module": {
                    "sellerId": "346360614",
                    "picturePath": null,
                    "pictureCategoryName": "aad",
                    "sorts": 0,
                    "type": 2,
                    "deleted": 0,
                    "total": 0,
                    "gmtCreate": 1442372459607,
                    "gmtModified": 1442372459607,
                    "parentId": "106141122482859956",
                    "pictureCategoryId": "106141122490019253",
                    "options": 0,
                    "featuresMap": {},
                    "spaceId": 0,
                    "fileType": 0,
                    "mountSpaceId": null,
                    "from": "pic"
                },
                "crsToken": "diN1l0InMZDBva2",
                "errorCode": null,
                "errorMessage": null,
                "jsonData": {
                    "id": "106141122490019253"
                }
            }

        },
        'pictureCategory': {
            url: 'http://tadget.taobao.com/redaction/redaction/json.json',
            data: {
                'order_by': '7',
                'ignore_cat': '0',
                'client_type': '',
                'status': '-1',
                'cat_id': '106141122482859956',
                'page': '1',
                'cmd': 'json_batch_query',
                '_input_charset': 'utf-8'
            },
            result: {
                "success": true,
                "message": null,
                "module": {
                    "total": 4,
                    "hasPicture": false,
                    "cat_num": 3,
                    "page": 1,
                    "cat_module": [{
                        "sellerId": "346360614",
                        "picturePath": null,
                        "pictureCategoryName": "aad",
                        "sorts": 0,
                        "type": 2,
                        "deleted": 0,
                        "total": null,
                        "gmtCreate": 1442372459000,
                        "gmtModified": 1442372459000,
                        "parentId": "106141122482859956",
                        "pictureCategoryId": "106141122490019253",
                        "options": 0,
                        "featuresMap": {},
                        "spaceId": 0,
                        "fileType": 0,
                        "mountSpaceId": null,
                        "from": "pic"
                    }, {
                        "sellerId": "346360614",
                        "picturePath": null,
                        "pictureCategoryName": "SD1231",
                        "sorts": 0,
                        "type": 2,
                        "deleted": 0,
                        "total": null,
                        "gmtCreate": 1442372173000,
                        "gmtModified": 1442372173000,
                        "parentId": "106141122482859956",
                        "pictureCategoryId": "106141122488879189",
                        "options": 0,
                        "featuresMap": {},
                        "spaceId": 0,
                        "fileType": 0,
                        "mountSpaceId": null,
                        "from": "pic"
                    }, {
                        "sellerId": "346360614",
                        "picturePath": null,
                        "pictureCategoryName": "MQ1040",
                        "sorts": 0,
                        "type": 2,
                        "deleted": 0,
                        "total": null,
                        "gmtCreate": 1442371974000,
                        "gmtModified": 1442372044000,
                        "parentId": "106141122482859956",
                        "pictureCategoryId": "106141122488096628",
                        "options": 0,
                        "featuresMap": {},
                        "spaceId": 0,
                        "fileType": 0,
                        "mountSpaceId": null,
                        "from": "pic"
                    }],
                    "pageSize": null,
                    "type": -1,
                    "file_module": [{
                        "pictureId": "106140122487784041",
                        "pictureCategoryId": "106141122482859956",
                        "picturePath": "i2/346360614/TB2d3VHfpXXXXb6XXXXXXXXXXXX_!!346360614.png",
                        "name": "15552430887_1.png",
                        "sizes": 120828,
                        "sellerId": "346360614",
                        "deleted": 0,
                        "status": 0,
                        "gmtCreate": 1442371893000,
                        "gmtModified": 1442372886000,
                        "pixel": "790x600",
                        "md5": "",
                        "options": 0,
                        "genShortURL": null,
                        "featuresMap": {},
                        "optionMap": null,
                        "fullUrl": "https://img.alicdn.com/imgextra/i2/346360614/TB2d3VHfpXXXXb6XXXXXXXXXXXX_!!346360614.png",
                        "picDomainOption": "",
                        "frezonMessage": null,
                        "pictureCategoryName": "handu",
                        "clientType": 0,
                        "fileType": 1,
                        "spaceId": 0,
                        "mountSpaceId": null,
                        "from": "pic",
                        "pictureVersion": null,
                        "sellerNick": null
                    }]
                },
                "crsToken": "diN1l0InMZDBva2"
            }
        }
    };

