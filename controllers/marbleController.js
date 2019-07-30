var fs = require('fs'),
    path = require('path');
const marbleModel = require('../models/marbles');
const { failure_callback, success_callback } = require('../common');
const utils = require('../utils');
var message;


module.exports = {


    marbleLotList: function(req, res) {

        if (req.query.sku == undefined || req.query.sku == '') {
            return failure_callback(res, ['sku is required', 400]);
        }

        let data = {};
        data.sku = req.query.sku.trim(),
            data.limit = (req.query.limit != '' && req.query.limit != null && req.query.limit != undefined) ? req.query.limit : 30;
        data.offset = (req.query.offset != '' && req.query.offset != null && req.query.offset != undefined) ? req.query.offset : 0;


        marbleModel.getMarbleLotList(data, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows == undefined || rows == null || rows == '') {

                res.json({ status: 200, total: 0, data: [], message: 'no records found' });

            } else {

                rows.length != 0 ? message = 'success' : message = 'no records found';

                res.json({ status: 200, total: rows.length, data: rows, message: message });
            }

        });

    },
    marbleSlabList: function(req, res) { //isAvailable is differ with availablity of slab i.e. sold = 0, Available = 1, blocked = 2

        if (req.query.sku == undefined || req.query.sku == '') {
            return failure_callback(res, ['sku is required', 400]);
        }

        let sku = req.query.sku.trim();

        marbleModel.getMarbleSlabList(sku, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows == undefined || rows == null || rows == '') {

                res.json({ status: 200, total: 0, data: [], message: 'no records found' });

            } else {

                rows.length != 0 ? message = 'success' : message = 'no records found';

                res.json({ status: 200, total: rows.length, data: rows, message: message });
            }

        });


    },
    marbleGalleryList: function(req, res) {

        if (req.query.sku == undefined || req.query.sku == '') {
            return failure_callback(res, ['sku is required', 400]);
        }

        let sku = req.query.sku.trim();
        let loc = `./data/sku/${sku}/gallery/`;

        getGallery(loc).then(function(data) {

            res.json({ status: 200, data: data, message: 'success' });

        })

    },
    similarMarblesList: function(req, res) {

        if (req.query.sku == undefined || req.query.sku == '') {
            return failure_callback(res, ['sku is required', 400]);
        }

        let data = {};
        data.sku = req.query.sku.trim(),
            data.limit = (req.query.limit != '' && req.query.limit != null && req.query.limit != undefined) ? req.query.limit : 30;
        data.offset = (req.query.offset != '' && req.query.offset != null && req.query.offset != undefined) ? req.query.offset : 0;

        marbleModel.getSimilarMarblesList(data, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows == undefined || rows == null || rows == '') {

                res.json({ status: 200, total: 0, data: [], message: 'no records found' });

            } else {

                rows.length != 0 ? message = 'success' : message = 'no records found';

                res.json({ status: 200, total: rows.length, data: rows, message: message });

            }

        });
    },
    marbleCombinationList: function(req, res) {

        if (req.query.sku == undefined || req.query.sku == '') {
            return failure_callback(res, ['sku is required', 400]);
        }

        let data = {};
        let i = 0;
        let dataArray = [];
        data.sku = req.query.sku.trim(),
            data.limit = (req.query.limit != '' && req.query.limit != null && req.query.limit != undefined) ? req.query.limit : 30;
        data.offset = (req.query.offset != '' && req.query.offset != null && req.query.offset != undefined) ? req.query.offset : 0;

        marbleModel.getMarbleCombinationList(data, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows == undefined || rows == null || rows == '') {

                res.json({ status: 200, total: 0, data: [], message: 'no records found' });

            } else {

                rows.forEach(async row => {

                    await GetSkuDetail(row).then(function(data) {

                        dataArray.push(data);
                        i++;

                        if (i == rows.length) {

                            dataArray.length != 0 ? message = 'success' : message = 'no records found';

                            res.json({ status: 200, total: dataArray.length, data: dataArray, message: message });

                        }
                    });

                });
            }
        })

    },


}


function GetSkuDetail(row) {
    return new Promise((resolve, reject) => {

        let dataArray = {
            sku: row.sku,
            wallSKU1: {},
            wallSKU2: {},
            wallSKU3: {},
            floorSKU1: {},
            floorSKU2: {},
            floorSKU3: {}

        };


        if (0) reject();
        getData(row.wallSKU1).then(function(data) {

            if (data.sku != '' && data.sku != undefined) {

                dataArray.wallSKU1 = { sku: data.sku, name: data.name, family: data.family, collection: data.collection, size: data.size };

            }

            getData(row.wallSKU2).then(function(data) {

                if (data.sku != '' && data.sku != undefined) {

                    dataArray.wallSKU2 = { sku: data.sku, name: data.name, family: data.family, collection: data.collection, size: data.size };

                }

                getData(row.wallSKU3).then(function(data) {


                    if (data.sku != '' && data.sku != undefined) {

                        dataArray.wallSKU3 = { sku: data.sku, name: data.name, family: data.family, collection: data.collection, size: data.size };

                    }

                    getData(row.floorSKU1).then(function(data) {

                        if (data.sku != '' && data.sku != undefined) {

                            dataArray.floorSKU1 = { sku: data.sku, name: data.name, family: data.family, collection: data.collection, size: data.size };

                        }

                        getData(row.floorSKU2).then(function(data) {

                            if (data.sku != '' && data.sku != undefined) {

                                dataArray.floorSKU2 = { sku: data.sku, name: data.name, family: data.family, collection: data.collection, size: data.size };

                            }

                            getData(row.floorSKU3).then(function(data) {

                                if (data.sku != '' && data.sku != undefined) {

                                    dataArray.floorSKU3 = { sku: data.sku, name: data.name, family: data.family, collection: data.collection, size: data.size };

                                }

                                resolve(dataArray);

                            })

                        })

                    })

                })

            })

        })

    })

}


function getData(sku) {

    return new Promise((resolve, reject) => {

        marbleModel.getPartialMarbleDetail(sku, function(err, rows1) {
            if (err) reject();

            resolve(rows1);
        })

    })

}



function getGallery(loc) {

    let er = false;

    return new Promise((resolve, reject) => {

        if (er) reject();


        let ImageCount = 0;
        let VideoCount = 0;

        fs.readdirSync(loc).forEach(file => {

            var ext = path.extname(file).toLocaleLowerCase();

            if (ext == '.png' || ext == '.jpg' || ext == '.gif' || ext == '.jpeg') {

                var filename = path.parse(file).name;

                parts = filename.split("thumb");

                if (parts.length < 2) {

                    ImageCount++;
                }
            }
        });

        fs.readdirSync(`${loc}/video/`).forEach(file => {

            var ext = path.extname(file).toLocaleLowerCase();

            if (ext == '.mp4' || ext == '.mov' || ext == '.webm' || ext == '.wmv') {

                VideoCount++;
            }
        });

        resolve({ galleryCount: ImageCount, videoCount: VideoCount });


    })

}