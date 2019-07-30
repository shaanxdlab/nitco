var fs = require('fs'),
    walk = require('walk'),
    path = require('path'),
    express = require('express'),
    async = require('async'),
    lookModel = require('./models/looks'),
    tileModel = require('./models/tiles'),
    marbleModel = require('./models/marbles');
const { failure_callback, success_callback } = require('./common');

module.exports.loadModels = function(opts, cb) {
    var options = opts || {},
        dir = path.join(__dirname, "models"),
        walker = walk.walk(dir, options),
        models = {},
        dbConnection = options.dbConnection;

    walker.on("file", function(root, fileStats, next) {
        var schema = require(path.join(root, fileStats.name)),
            modelName = fileStats.name.replace(".js", ""),
            schema = schema(opts);
        var type = fileStats.name.split('.').pop();

        if (dbConnection && type == 'js') {
            var model = dbConnection.model(modelName, schema);
            models[modelName] = model;
        }

        next();
    });

    walker.on("end", function() {
        if (cb) {
            cb(null, models);
        }
    });
}

module.exports.loadControllers = function(opts, cb) {
    var options = opts || {},
        dir = path.join(__dirname, "app", "controllers"),
        walker = walk.walk(dir, options),
        controllers = [];

    walker.on("file", function(root, fileStats, next) {
        var controllerFunc = require(path.join(root, fileStats.name));
        var type = root.split('/').pop();

        controllers.push({ func: controllerFunc, type: type });
        next();
    });

    walker.on("end", function() {
        if (cb) {
            cb(null, controllers);
        }
    });
}


module.exports.countGallery = function(path) {

    console.log(path);

    return new Promise((resolve, reject) => {

        fs.readdir(path, function(err, items) {

            if (err) reject();

            resolve(items.length);

        });
    })


}

module.exports.sync = function(app, results, scallback) {
    async.parallel([
        function(cb) {
            async.each(results[0], function(item, callback) {
                var middleware = item.middleware({ models: results[1], config: config });
                var accessType = item.type;
                app.post("*/*", express.bodyParser(), middleware);

                callback(null);
            }, function(err) {
                if (cb) {
                    cb(err);
                }
            });
        },
        function(cb) {
            async.each(results[2], function(item, callback) {
                var controller = item.func({ models: results[1], config: config, mailer: mailer, notification: notification, pdf: pdf, signinModels: results[3], crons: results[4] });
                var accessType = item.type;
                var keys = Object.keys(controller);

                for (var i = 0; i < keys.length; i++) {
                    var name = keys[i],
                        params = name.split("#"),
                        type = params[0],
                        method = params[1];

                    if (accessType == "controllers") {
                        if (type == "get") {
                            app.get("/api/" + method, express.bodyParser(), controller[name]);
                        } else if (type == "post") {
                            app.post("/api/" + method, express.bodyParser(), controller[name]);
                        }
                    } else {
                        if (type == "get") {
                            app.get("/api/" + method, express.bodyParser(), controller[name]);
                        } else if (type == "post") {
                            app.post("/api/" + method, express.bodyParser(), controller[name]);
                        }
                    }
                }

                callback(null);
            }, function(err) {
                if (cb) {
                    cb(err);
                }
            });
        },
    ], function(err) {
        scallback(err)
    });
}




module.exports.getSKUDetail = function(data, callback) {

    var table = data[0],
        SKU = data[1];

    if (table == 'lookMaster') {

        lookModel.getLookDetail(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (rows.length == 0) {

                return callback(null, 0);
            }

            var lookArray = {

                galleryCount: 0,
                galleryList: []
            };

            lookArray.sku = rows.sku;
            lookArray.name = rows.name;
            lookArray.description = rows.description;
            lookArray.priceCategory = rows.priceCategory;
            lookArray.numViews = rows.numViews;


            module.exports.countGallery(`./data/looks/${SKU}/gallery/`).then(function(data) {

                if (data != null && data != '') {
                    lookArray.galleryCount = data;
                } else {

                    lookArray.galleryCount = 0;

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

                                                            console.log(lookArray);

                                                            return callback(null, ['looks', lookArray]);


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


    } else if (table == 'tileMaster') {


        tileModel.getTileDetail(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                var resArray = {

                detail: [],
                properties: [],
                suitableFor: [],
                galleryCount: 0,
                galleryList: []

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

            });

            return callback(null, ['tiles', resArray]);

        });


    } else if (table == 'stoneMaster') {

        marbleModel.getMarbleDetail(SKU, function(err, rows) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

                var resArray = {

                detail: [],
                properties: [],
                suitableFor: [],
                galleryCount: 0,
                galleryList: []

            };

            rows.forEach((row) => {

                resArray.sku = row.sku;
                resArray.name = row.name;
                resArray.collection = row.collection;
                resArray.category = row.category;
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

            });

            return callback(null, ['marbles', resArray]);

        });

    } else if (table == 'mossacMaster') {

    }


}



function getData(type, sku) {

    console.log('In getData function');

    return new Promise((resolve, reject) => {

        lookModel.getSkuDetail({ type: type, sku: sku }, function(err, rows1) {
            if (err) reject();

            resolve(rows1);
        })

    })

}