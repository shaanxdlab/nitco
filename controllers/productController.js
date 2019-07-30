const productModel = require('../models/products');
const { failure_callback, success_callback } = require('../common');
var message;


module.exports = {


    productValidation: function(req, res, next) { //check the devision duplicacy

        if (req.query.spaces == undefined || req.query.spaces == '') {
            return failure_callback(res, ['spaces is required', 400]);
        } else return next();
    },


    productsList: function(req, res) { //get tiles list

        var data = {};
        data.keyword = (req.query.keyword != '' && req.query.keyword != null && req.query.keyword != undefined) ? req.query.keyword.trim() : null,
            data.space = (req.query.spaces != '' && req.query.spaces != null && req.query.spaces != undefined) ? req.query.spaces.trim() : 'all',
            data.surface = (req.query.surfaces != '' && req.query.surfaces != null && req.query.surfaces != undefined) ? req.query.surfaces.trim() : 'all',
            data.color = (req.query.color != '' && req.query.color != null && req.query.color != undefined) ? req.query.color.trim() : 'all',
            data.price = (req.query.price != '' && req.query.price != null && req.query.price != undefined) ? req.query.price.trim() : 'all',
            data.material = (req.query.material != '' && req.query.material != null && req.query.material != undefined) ? req.query.material.trim() : 'all',
            data.product_size = (req.query.product_size != '' && req.query.product_size != null && req.query.product_size != undefined) ? req.query.product_size.trim() : 'all',
            data.properties = (req.query.properties != '' && req.query.properties != null && req.query.properties != undefined) ? req.query.properties.trim() : 'all';

        data.limit = (req.query.limit != '' && req.query.limit != null && req.query.limit != undefined) ? req.query.limit : 30;
        data.offset = (req.query.offset != '' && req.query.offset != null && req.query.offset != undefined) ? req.query.offset : 0;

        productModel.getProductsList(data, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows == undefined || rows == null || rows == 'null') {

            } else {
                rows.length != 0 ? message = 'success' : message = 'no records found';

                res.json({ status: 200, total: rows.length, data: rows, message: message });
            }

        });


    },


    productsInThisCollection: function(req, res) { //get tiles list

        if (req.query.sku == undefined || req.query.sku == '') {
            return failure_callback(res, ['sku is required', 400]);
        }

        let SKU = req.query.sku.trim();

        productModel.getProductCollectionList(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows == undefined || rows == null || rows == 'null') {

                res.json({ status: 200, total: 0, data: [], message: 'no records found' });

            } else {

                rows.length != 0 ? message = 'success' : message = 'no records found';

                res.json({ status: 200, total: rows.length, data: rows, message: message });

            }

        });


    },

    similarProductsList: function(req, res) { //get similar products list

        if (req.query.sku == undefined || req.query.sku == '') {
            return failure_callback(res, ['sku is required', 400]);
        }

        let SKU = req.query.sku.trim();

        productModel.getSimilarProductsList(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows == undefined || rows == null || rows == 'null' || rows == 0) {

                res.json({ status: 200, total: 0, data: [], message: 'no records found' });

            } else {

                rows.length != 0 ? message = 'success' : message = 'no records found';

                res.json({ status: 200, total: rows.length, data: rows, message: message });

            }

        });


    },

    combinationProductsList: function(req, res) { //get tiles list

        if (req.query.sku == undefined || req.query.sku == '') {
            return failure_callback(res, ['sku is required', 400]);
        }

        let SKU = req.query.sku.trim();

        productModel.getCombinationSKU(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows == undefined || rows == null || rows == '') {

                res.json({ status: 200, total: 0, data: [], message: 'no records found' });

            } else {

                getData(rows, SKU).then(function(data) {

                    if (data == undefined || data == null || data == 'null') {

                        productModel.getRandomProductsList(data, function(err, rows) {

                            if (err) return failure_callback(res, ['error in query', 500]);

                            else

                            if (rows == undefined || rows == null || rows == 'null') {

                                res.json({ status: 200, total: 0, data: [], message: 'no records found' });

                            } else {

                                rows.length != 0 ? message = 'success' : message = 'no records found';

                                res.json({ status: 200, total: rows.length, data: rows, message: message });

                            }

                        });

                    } else {

                        productModel.getCombinationProductsList(data, function(err, rows) {

                            if (err) return failure_callback(res, ['error in query', 500]);

                            else

                            if (rows == undefined || rows == null || rows == 'null') {

                                res.json({ status: 200, total: 0, data: [], message: 'no records found' });

                            } else {

                                rows.length != 0 ? message = 'success' : message = 'no records found';

                                res.json({ status: 200, total: rows.length, data: rows, message: message });

                            }

                        });


                    }


                })
            }

        });


    },

}


function getData(rows, SKU) {

    let SKUArray = [],
        i = 0;

    return new Promise((resolve, reject) => {

        if (rows == undefined || rows == null || rows == '') {

            reject([]);

        } else {

            rows.forEach(row => {

                console.log(row.wallSKU3);

                if ((row.wallSKU1 != null && row.wallSKU1 != SKU) && SKUArray.indexOf(row.wallSKU1) === -1) {
                    SKUArray.push(row.wallSKU1);
                } else if ((row.wallSKU2 != null && row.wallSKU2 != SKU) && SKUArray.indexOf(row.wallSKU2) === -1) {
                    SKUArray.push(row.wallSKU2);
                } else if ((row.wallSKU3 != null && row.wallSKU3 != SKU) && SKUArray.indexOf(row.wallSKU3) === -1) {
                    SKUArray.push(row.wallSKU3);
                } else if ((row.floorSKU1 != null && row.floorSKU1 != SKU) && SKUArray.indexOf(row.floorSKU1) === -1) {
                    SKUArray.push(row.floorSKU1);
                } else if ((row.floorSKU2 != null && row.floorSKU2 != SKU) && SKUArray.indexOf(row.floorSKU2) === -1) {
                    SKUArray.push(row.floorSKU2);
                } else if ((row.floorSKU3 != null && row.floorSKU3 != SKU) && SKUArray.indexOf(row.floorSKU3) === -1) {
                    SKUArray.push(row.floorSKU3);
                }

                i++;
            });

            if (rows.length == i) {
                resolve(SKUArray);
            }


        }


    })


}