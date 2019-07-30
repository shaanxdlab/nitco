var striptags = require('striptags'),
    slashes = require('slashes'),
    utils = require('../utils');
const homeModel = require('../models/home');
const lookModel = require('../models/looks');
const tileModel = require('../models/tiles');
const { check } = require('express-validator');
const { failure_callback, success_callback } = require('../common');
var message;


module.exports = {


    roomValidation: function(req, res, next) { //check the devision duplicacy


        if (typeof req.query.type == 'undefined' || req.query.type == '') {
            return failure_callback(res, ['room type is required', 400]);
        } else if (typeof req.query.size == 'undefined' || req.query.size == '') {
            return failure_callback(res, ['room size is required', 400]);
        } else return next();
    },

    roomList: function(req, res) { //get all rooms list

        var data = {};
        data.type = req.query.type,
            data.size = req.query.size;

        homeModel.getRoomsList(data, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                rows.length != 0 ? message = 'success' : message = 'no records found';

            res.json({ status: 200, total: rows.length, data: rows, message: message });

        });


    },
    filterList: async function(req, res) { //get filter list

        var table = req.query.type.toLowerCase().trim();

        if (table == 'looks' || table == 'look') {
            var filterArray = {

                spaces: [],
                surfaces: [],
                products: ['tiles', 'marbles,', 'mosaico', 'mixed'],
                colour: [],
                price_range: [],
                space_size: [],
                properties: []
            };
            var filter = ['spaces', 'surfaces', 'colour', 'price_range', 'space_size', 'properties'];
        } else if (table == 'products' || table == 'product') {
            var filterArray = {

                spaces: [],
                surfaces: [],
                colour: [],
                price_range: [],
                product_size: [],
                material: [],
                properties: []
            };
            var filter = ['spaces', 'surfaces', 'colour', 'price_range', 'product_size', 'material', 'properties'];
        } else {

            res.json({ status: 200, data: null, message: 'no record' });
        }

        for (var i = 0; i < filter.length; i++) {

            await getFilter({ type: filter[i], table: table }).then(function(data) {


                if (data != null && data != '') {

                    data.forEach((row) => {

                        if (row.maxPrice != null && row.minPrice != '') {
                            filterArray[filter[i]].push(row.minPrice, row.maxPrice);
                        } else {
                            filterArray[filter[i]].push(row.value);
                        }

                    });



                } else {
                    //filterArray.filter[i] = {};
                }


            })

            if (i == (filter.length - 1)) {

                res.json({ status: 200, data: filterArray, message: message });
            }
        }

    },

    skuDetail: async function(req, res) { //get filter list

        var sku = req.query.sku.trim();

        homeModel.getSkuTable(sku, function(err, table) {

            if (err) console.log(err.message);

            if (table == 0) {
                res.json({ status: 200, data: null, message: 'SKU ot found' });
            } else {

                utils.getSKUDetail([table, sku], function(err, data) {

                    if (err) console.log(err.message);

                    console.log(data);

                    if (table == 'lookMaster') {

                        res.json({ status: 200, screen: data[0], data: data[1], message: message });

                    } else {

                        homeModel.getLookSKUsList(sku, function(err, rows) {

                            if (err) console.log(err.message);

                            let SkuArray = rows[0].sku.split(",");

                            data[1].galleryCount = SkuArray.length;

                            data[1].galleryList = SkuArray;

                            res.json({ status: 200, screen: data[0], data: data[1], message: message });

                        })

                    }

                });

            }

        });

    },

}




function getFilter(data) {

    console.log('In getData function');
    console.log(data);

    return new Promise((resolve, reject) => {

        homeModel.getFilterList(data, function(err, rows) {
            if (err) reject();


            console.log(rows);

            resolve(rows);
        })

    })

}