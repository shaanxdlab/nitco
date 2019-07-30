const utils = require('../utils');
const homeModel = require('../models/home');
const lookModel = require('../models/looks');
const tileModel = require('../models/tiles');
const { failure_callback, success_callback } = require('../common');
var message;

module.exports = {

    roomValidation: function(req, res, next) { //check the devision duplicacy


        if (req.query.type == undefined || req.query.type == '') {
            return failure_callback(res, ['room type is required', 400]);
        } else if (req.query.size == undefined || req.query.size == '') {
            return failure_callback(res, ['room size is required', 400]);
        } else return next();
    },

    roomList: function(req, res) { //get all rooms list

        var data = {};
        data.type = req.query.type.trim(),
            data.size = req.query.size.trim();

        homeModel.getRoomsList(data, function(err, rows) {

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
    filterList: async function(req, res) { //get filter list

        let t = 0;

        if (req.query.type == undefined || req.query.type == undefined || req.query.type == '') {
            return failure_callback(res, ['filter type is required', 400]);
        }

        var table = req.query.type.toLowerCase().trim();

        if (table == 'looks' || table == 'look') {
            var filterArray = {

                spaces: [],
                surfaces: [],
                products: ['Tiles', 'Marbles', 'Mosaico', 'Mixed'],
                colour: [],
                price_range: [],
                space_size: [],
                properties: []
            };
            var filter = ['spaces', 'surfaces', 'colour', 'price_range', 'space_size', 'properties'];
            t = 1;
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
            t = 1;
        }


        if (t == 1) {


            for (var i = 0; i < filter.length; i++) {

                await getFilter({ type: filter[i], table: table }).then(function(data) {


                    if (data != null && data != '') {

                        data.forEach((row) => {

                            if (row.maxPrice != null && row.minPrice != '') {
                                filterArray[filter[i]].push(row.minPrice, row.maxPrice);
                            } else {

                                if (filterArray[filter[i]].indexOf(row.value) === -1) {
                                    filterArray[filter[i]].push(row.value);
                                }

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
        } else {
            res.json({ status: 200, data: [], message: 'no record' });
        }




    },

    skuDetail: async function(req, res) { //Get sku detail genric function

        if (req.query.sku == undefined || req.query.sku == '') {
            return failure_callback(res, ['sku is required', 400]);
        }

        var sku = req.query.sku.trim();

        homeModel.getSkuTable(sku, function(err, table) {

            if (err) console.log(err.message);

            if (table == 0) {
                res.json({ status: 200, data: [], message: 'SKU not found' });
            } else {

                utils.getSKUDetail([table, sku], function(err, data) {

                    if (err) console.log(err.message);

                    if (table == 'lookMaster') {

                        data[1].description = 'NITCO symbolizes stylized spaces, designs that redefine grandeur and a sense of fashion that is second to none.';

                        res.json({ status: 200, screen: data[0], data: data[1], message: message });

                    } else {

                        homeModel.getLookSKUsList(sku, function(err, rows) {

                            if (err) console.log(err.message);


                            if (rows[0].sku != undefined && rows[0].sku != null && rows[0].sku != '') {

                                let SkuArray = rows[0].sku.split(",");
                                data[1].galleryCount = SkuArray.length;
                                data[1].galleryList = SkuArray;

                                console.log('iam in if condition');

                            } else {

                                data[1].galleryCount = 0;
                                data[1].galleryList = [];

                                console.log('iam in else condition');

                            }



                            data[1].description = 'NITCO symbolizes stylized spaces, designs that redefine grandeur and a sense of fashion that is second to none.';

                            res.json({ status: 200, data: data[1], message: "sku Detail" });

                        })

                    }

                });

            }

        });

    },

}




function getFilter(data) {

    // console.log('In getData function');
    // console.log(data);

    return new Promise((resolve, reject) => {

        homeModel.getFilterList(data, function(err, rows) {
            if (err) reject();


            // console.log(rows);

            resolve(rows);
        })

    })

}