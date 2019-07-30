var striptags = require('striptags'),
    slashes = require('slashes');
const productModel = require('../models/products');
const { check } = require('express-validator');
const { failure_callback, success_callback } = require('../common');
var message;


module.exports = {


    productsList: function(req, res) { //get tiles list

        var data = {};
        data.keyword = req.query.keyword.trim(),
            data.space = req.query.space.trim(),
            data.surface = req.query.surface.trim(),
            data.color = req.query.color.trim(),
            data.price = req.query.price.trim(),
            data.space_size = req.query.space_size.trim(),
            data.material = req.query.material.trim(),
            data.product_size = req.query.product_size.trim(),
            data.properties = req.query.properties.trim();
        data.limit = (req.query.limit.trim() != '' && req.query.limit != null && req.query.limit != 'undefined') ? req.query.limit : 30;
        data.offset = (req.query.offset.trim() != '' && req.query.offset != null && req.query.offset != 'undefined') ? req.query.offset : 0;

        productModel.getProductsList(data, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                rows.length != 0 ? message = 'success' : message = 'no records found';

            res.json({ status: 200, total: rows.length, data: rows, message: message });

        });


    },


    productsInThisCollection: function(req, res) { //get tiles list

        let SKU = req.query.sku.trim();

        productModel.getProductCollectionList(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                rows.length != 0 ? message = 'success' : message = 'no records found';

            res.json({ status: 200, total: rows.length, data: rows, message: message });

        });


    },

    similarProductsList: function(req, res) { //get tiles list

        let SKU = req.query.sku.trim();

        productModel.getSimilarProductsList(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                rows.length != 0 ? message = 'success' : message = 'no records found';

            res.json({ status: 200, total: rows.length, data: rows, message: message });

        });


    },

    combinationProductsList: function(req, res) { //get tiles list

        let SKU = req.query.sku.trim();

        let SKUArray = [];

        productModel.getCombinationSKU(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

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
            });


            if (SKUArray != null) {
                productModel.getCombinationProductsList(SKUArray, function(err, rows) {

                    if (err) return failure_callback(res, ['error in query', 500]);

                    else

                        rows.length != 0 ? message = 'success' : message = 'no records found';

                    res.json({ status: 200, total: rows.length, data: rows, message: message });

                });


            } else {

                productModel.getRandomProductsList(SKUArray, function(err, rows) {

                    if (err) return failure_callback(res, ['error in query', 500]);

                    else

                        rows.length != 0 ? message = 'success' : message = 'no records found';

                    res.json({ status: 200, total: rows.length, data: rows, message: message });

                });
            }


        });


    },



}