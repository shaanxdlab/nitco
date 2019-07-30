var striptags = require('striptags'),
    slashes = require('slashes');
const productModel = require('../models/tiles');
const { check } = require('express-validator');
const { failure_callback, success_callback } = require('../common');
var message;


module.exports = {


    tileValidation: function(req, res, next) { //check the devision duplicacy


        if (typeof req.query.type == 'undefined' || req.query.type == '') {
            return failure_callback(res, ['room type is required', 400]);
        } else if (typeof req.query.size == 'undefined' || req.query.size == '') {
            return failure_callback(res, ['room size is required', 400]);
        } else return next();
    },


    tilesList: function(req, res) { //get tiles list

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

        productModel.getTilesList(data, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                rows.length != 0 ? message = 'success' : message = 'no records found';

            res.json({ status: 200, total: rows.length, data: rows, message: message });

        });


    },

    tileDetail: function(req, res) { //get tiles list

        let SKU = req.query.sku.trim();

        console.log(SKU);

        productModel.getTileDetail(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                var resArray = {

                detail: [],
                properties: [],
                suitableFor: []

            };

            rows.forEach((row) => {

                resArray.sku = row.sku;
                resArray.name = row.name;
                resArray.collection = row.collection;
                resArray.isFloor = row.isFloor;
                resArray.isWall = row.isWall;
                resArray.isAvailable = row.isAvailable;

                if (row.head == 'details') {
                    resArray.detail.push({

                        'name': row.heading,
                        'value': row.value,
                        'unit': row.unit,
                        'package': row.package
                    });
                }

                if (row.head == 'properties') {
                    resArray.properties.push(row.value);
                }

                if (row.head == 'suitable_spaces') {
                    resArray.suitableFor.push(row.value);
                }

                console.log(row);

            });

            rows.length != 0 ? message = 'success' : message = 'no records found';

            res.json({ status: 200, data: resArray, message: message });

        });


    },

    tilesInThisCollection: function(req, res) { //get tiles list

        let SKU = req.query.sku.trim();

        productModel.getTilesCollectionList(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                rows.length != 0 ? message = 'success' : message = 'no records found';

            res.json({ status: 200, total: rows.length, data: rows, message: message });

        });


    },

    similarTilesList: function(req, res) { //get tiles list

        let SKU = req.query.sku.trim();

        productModel.getSimilarTilesList(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                rows.length != 0 ? message = 'success' : message = 'no records found';

            res.json({ status: 200, total: rows.length, data: rows, message: message });

        });


    },

    combinationTilesList: function(req, res) { //get tiles list

        let SKU = req.query.sku.trim();

        productModel.getCombinationTilesList(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                rows.length != 0 ? message = 'success' : message = 'no records found';

            res.json({ status: 200, total: rows.length, data: rows, message: message });

        });


    },



}