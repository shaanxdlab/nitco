var striptags = require('striptags'),
    slashes = require('slashes');
const productModel = require('../models/looks');
const util = require('../utils');
const { check } = require('express-validator');
const { failure_callback, success_callback } = require('../common');
var message;


module.exports = {


    looksList: function(req, res) { //get tiles list

        var data = {};
        data.keyword = (req.query.keyword.trim() != '' && req.query.keyword != null && req.query.keyword != 'undefined') ? req.query.keyword : null,
            data.space = (req.query.spaces.trim() != '' && req.query.spaces != null && req.query.spaces != 'undefined') ? req.query.spaces : 'all',
            data.surface = (req.query.surfaces.trim() != '' && req.query.surfaces != null && req.query.surfaces != 'undefined') ? req.query.surfaces : 'all',
            data.products = (req.query.products.trim() != '' && req.query.products != null && req.query.products != 'undefined') ? req.query.products : 'all',
            data.color = (req.query.colour.trim() != '' && req.query.colour != null && req.query.colour != 'undefined') ? req.query.colour : 'all',
            data.price_range = (req.query.price_range.trim() != '' && req.query.price_range != null && req.query.price_range != 'undefined') ? req.query.price_range : 'all',
            data.space_size = (req.query.space_size.trim() != '' && req.query.space_size != null && req.query.space_size != 'undefined') ? req.query.space_size : 'all',
            data.properties = (req.query.properties.trim() != '' && req.query.properties != null && req.query.properties != 'undefined') ? req.query.properties : 'all';
        data.limit = (req.query.limit.trim() != '' && req.query.limit != null && req.query.limit != 'undefined') ? req.query.limit : 30;
        data.offset = (req.query.offset.trim() != '' && req.query.offset != null && req.query.offset != 'undefined') ? req.query.offset : 0;

        productModel.getLooksList([data, 0], function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else


                console.log(rows);

            productModel.getLooksList([data, 1], function(err, totalCount) {

                if (err) return failure_callback(res, ['error in query', 500]);

                rows.length != 0 ? message = 'success' : message = 'no records found';

                res.json({ status: 200, total: totalCount.total, data: rows, message: message });

            });



        });


    },


    lookDetail: function(req, res) {

        let SKU = req.query.sku.trim();

        productModel.getLookDetail(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows.length == 0) {
                res.json({ status: 'no records found', total: rows.length, data: rows });
            }

            var lookArray = {};

            lookArray.sku = rows.sku;
            lookArray.name = rows.name;
            lookArray.description = rows.description;
            lookArray.priceCategory = rows.priceCategory;
            lookArray.numViews = rows.numViews;

            util.countGallery(`data/looks/${SKU}/gallery/`).then(function(data) {

                if (data != null && data != '') {
                    lookArray['galleryCount'] = data;
                } else {

                    lookArray['galleryCount'] = 0;

                }
            })


            getData(rows.wallType1, rows.wallSKU1).then(function(data) {

                    if (data != null && data != '') {
                        data['type'] = rows.wallType1;
                        lookArray.wallSKU1 = data;
                    } else {

                        lookArray.wallSKU1 = {};

                    }

                    getData(rows.wallType2, rows.wallSKU2).then(function(data) {

                            if (data != null && data != '') {
                                data['type'] = rows.wallType2;
                                lookArray.wallSKU2 = data;
                            } else {

                                lookArray.wallSKU2 = {};

                            }

                            getData(rows.wallType3, rows.wallSKU3).then(function(data) {

                                    if (data != null && data != '') {
                                        data['type'] = rows.wallType3;
                                        lookArray.wallSKU3 = data;
                                    } else {

                                        lookArray.wallSKU3 = {};

                                    }

                                    getData(rows.floorType1, rows.floorSKU1).then(function(data) {

                                            if (data != null && data != '') {
                                                data['type'] = rows.floorType1;
                                                lookArray.floorSKU1 = data;
                                            } else {

                                                lookArray.floorSKU1 = {};

                                            }

                                            getData(rows.floorType2, rows.floorSKU2).then(function(data) {

                                                    if (data != null && data != '') {
                                                        data['type'] = rows.floorType2;
                                                        lookArray.floorSKU2 = data;
                                                    } else {

                                                        lookArray.floorSKU2 = {};

                                                    }

                                                    getData(rows.floorType3, rows.floorSKU3).then(function(data) {

                                                            if (data != null && data != '') {
                                                                data['type'] = rows.floorType3;
                                                                lookArray.floorSKU3 = data;
                                                            } else {

                                                                lookArray.floorSKU3 = {};

                                                            }

                                                            lookArray.length != 0 ? message = 'success' : message = 'no records found';

                                                            res.json({ status: 200, data: lookArray, message: message });


                                                        }

                                                    );


                                                }

                                            );
                                        }

                                    );

                                }

                            );


                        }

                    );

                }

            );

        });

    },

    similarLooksList: function(req, res) { //get tiles list

        let SKU = req.query.sku.trim();

        productModel.getSimilarLooksList(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                rows.length != 0 ? message = 'success' : message = 'no records found';

            let SkuArray = rows[0].sku.split(",");

            res.json({ status: 200, total: SkuArray.length, data: SkuArray, message: message });

        });


    },



    stylesList: function(req, res) { //get tiles list

        var data = {};
        data.keyword = (req.query.keyword.trim() != '' && req.query.keyword != null && req.query.keyword != 'undefined') ? req.query.keyword : null,
            data.space = (req.query.spaces.trim() != '' && req.query.spaces != null && req.query.spaces != 'undefined') ? req.query.spaces : 'all',
            data.surface = (req.query.surfaces.trim() != '' && req.query.surfaces != null && req.query.surfaces != 'undefined') ? req.query.surfaces : 'all',
            data.products = (req.query.products.trim() != '' && req.query.products != null && req.query.products != 'undefined') ? req.query.products : 'all',
            data.color = (req.query.colour.trim() != '' && req.query.colour != null && req.query.colour != 'undefined') ? req.query.colour : 'all',
            data.price_range = (req.query.price_range.trim() != '' && req.query.price_range != null && req.query.price_range != 'undefined') ? req.query.price_range : 'all',
            data.space_size = (req.query.space_size.trim() != '' && req.query.space_size != null && req.query.space_size != 'undefined') ? req.query.space_size : 'all',
            data.properties = (req.query.properties.trim() != '' && req.query.properties != null && req.query.properties != 'undefined') ? req.query.properties : 'all';
        data.limit = (req.query.limit.trim() != '' && req.query.limit != null && req.query.limit != 'undefined') ? req.query.limit : 30;
        data.offset = (req.query.offset.trim() != '' && req.query.offset != null && req.query.offset != 'undefined') ? req.query.offset : 0;

        productModel.getStylesList([data, 0], function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else


                console.log(rows);

            productModel.getStylesList([data, 1], function(err, totalCount) {

                if (err) return failure_callback(res, ['error in query', 500]);

                rows.length != 0 ? message = 'success' : message = 'no records found';

                res.json({ status: 200, total: totalCount.total, data: rows, message: message });

            });



        });


    },




    styleDetail: function(req, res) {

        let SKU = req.query.sku.trim();

        productModel.getLookDetail(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows.length == 0) {
                res.json({ status: 'no records found', total: rows.length, data: rows });
            }

            var lookArray = {};

            lookArray.sku = rows.sku;
            lookArray.name = rows.name;
            lookArray.description = rows.description;
            lookArray.priceCategory = rows.priceCategory;
            lookArray.numViews = rows.numViews;

            util.countGallery(`data/looks/${SKU}/gallery/`).then(function(data) {

                if (data != null && data != '') {
                    lookArray['galleryCount'] = data;
                } else {

                    lookArray['galleryCount'] = 0;

                }
            })


            getData(rows.wallType1, rows.wallSKU1).then(function(data) {

                    if (data != null && data != '') {
                        data['type'] = rows.wallType1;
                        lookArray.wallSKU1 = data;
                    } else {

                        lookArray.wallSKU1 = {};

                    }

                    getData(rows.wallType2, rows.wallSKU2).then(function(data) {

                            if (data != null && data != '') {
                                data['type'] = rows.wallType2;
                                lookArray.wallSKU2 = data;
                            } else {

                                lookArray.wallSKU2 = {};

                            }

                            getData(rows.wallType3, rows.wallSKU3).then(function(data) {

                                    if (data != null && data != '') {
                                        data['type'] = rows.wallType3;
                                        lookArray.wallSKU3 = data;
                                    } else {

                                        lookArray.wallSKU3 = {};

                                    }

                                    getData(rows.floorType1, rows.floorSKU1).then(function(data) {

                                            if (data != null && data != '') {
                                                data['type'] = rows.floorType1;
                                                lookArray.floorSKU1 = data;
                                            } else {

                                                lookArray.floorSKU1 = {};

                                            }

                                            getData(rows.floorType2, rows.floorSKU2).then(function(data) {

                                                    if (data != null && data != '') {
                                                        data['type'] = rows.floorType2;
                                                        lookArray.floorSKU2 = data;
                                                    } else {

                                                        lookArray.floorSKU2 = {};

                                                    }

                                                    getData(rows.floorType3, rows.floorSKU3).then(function(data) {

                                                            if (data != null && data != '') {
                                                                data['type'] = rows.floorType3;
                                                                lookArray.floorSKU3 = data;
                                                            } else {

                                                                lookArray.floorSKU3 = {};

                                                            }

                                                            lookArray.length != 0 ? message = 'success' : message = 'no records found';

                                                            res.json({ status: 200, data: lookArray, message: message });


                                                        }

                                                    );


                                                }

                                            );
                                        }

                                    );

                                }

                            );


                        }

                    );

                }

            );

        });

    },


    similarStylesList: function(req, res) { //get tiles list

        let SKU = req.query.sku.trim();

        productModel.getSimilarStylesList(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                rows.length != 0 ? message = 'success' : message = 'no records found';

            let SkuArray = rows[0].sku.split(",");

            res.json({ status: 200, total: SkuArray.length, data: SkuArray, message: message });

        });


    },



}

function getData(type, sku) {

    console.log('In getData function');

    return new Promise((resolve, reject) => {

        productModel.getSkuDetail({ type: type, sku: sku }, function(err, rows1) {
            if (err) reject();

            resolve(rows1);
        })

    })

}