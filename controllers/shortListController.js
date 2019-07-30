var fs = require('fs'),
    jimp = require('jimp'),
    util = require('../utils');
const tripModel = require('../models/trips');
const shortListModel = require('../models/shortlist');
const productModel = require('../models/looks');
const { failure_callback, success_callback } = require('../common');
var message;

module.exports = {


    addShortListValidation: function(req, res, next) { //check collection validation

        if (req.body.tripId == undefined || req.body.tripId == '') {
            return failure_callback(res, ['tripId is required', 400]);
        } else if (req.body.roomSku == undefined || req.body.roomSku == '') {
            return failure_callback(res, ['roomSku is required', 400]);
        } else if (req.body.choiceType == undefined || req.body.choiceType == '') {
            return failure_callback(res, ['choiceType is required', 400]);
        } else if (req.body.spaceType == undefined || req.body.spaceType == '') {
            return failure_callback(res, ['spaceType is required', 400]);
        } else if (req.body.installId == undefined || req.body.installId == '') {
            return failure_callback(res, ['installId is required', 400]);
        } else if (req.body.image == undefined || req.body.image == '') {
            return failure_callback(res, ['base64 image is required', 400]);
        } else if ((req.body.wallSKU1 == undefined || req.body.wallSKU1 == null || req.body.wallSKU1 == '') &&
            (req.body.wallSKU2 == undefined || req.body.wallSKU2 == null || req.body.wallSKU2 == '') &&
            (req.body.wallSKU3 == undefined || req.body.wallSKU3 == null || req.body.wallSKU3 == '') &&
            (req.body.floorSKU1 == undefined || req.body.floorSKU1 == null || req.body.floorSKU1 == '') &&
            (req.body.floorSKU2 == undefined || req.body.floorSKU2 == null || req.body.floorSKU2 == '') &&
            (req.body.floorSKU3 == undefined || req.body.floorSKU3 == null || req.body.floorSKU3 == '')) {

            return failure_callback(res, ['Atleast one product sku is required', 400]);

        } else if ((req.body.wallSKU1 != undefined && req.body.wallSKU1 != null && req.body.wallSKU1 != '') &&
            (req.body.wallType1 == undefined || req.body.wallType1 == null || req.body.wallType1 == '')) {

            return failure_callback(res, ['wallType1 is required', 400]);

        } else if ((req.body.wallSKU2 != undefined && req.body.wallSKU2 != null && req.body.wallSKU2 != '') &&
            (req.body.wallType2 == undefined || req.body.wallType2 == null || req.body.wallType2 == '')) {

            return failure_callback(res, ['wallType2 is required', 400]);

        } else if ((req.body.wallSKU3 != undefined && req.body.wallSKU3 != null && req.body.wallSKU3 != '') &&
            (req.body.wallType3 == undefined || req.body.wallType3 == null || req.body.wallType3 == '')) {

            return failure_callback(res, ['wallType3 is required', 400]);

        } else if ((req.body.floorSKU1 != undefined && req.body.floorSKU1 != null && req.body.floorSKU1 != '') &&
            (req.body.floorType1 == undefined || req.body.floorType1 == null || req.body.floorType1 == '')) {

            return failure_callback(res, ['floorType1 is required', 400]);

        } else if ((req.body.floorSKU2 != undefined && req.body.floorSKU2 != null && req.body.floorSKU2 != '') &&
            (req.body.floorType2 == undefined || req.body.floorType2 == null || req.body.floorType2 == '')) {

            return failure_callback(res, ['floorType2 is required', 400]);

        } else if ((req.body.floorSKU3 != undefined && req.body.floorSKU3 != null && req.body.floorSKU3 != '') &&
            (req.body.floorType3 == undefined || req.body.floorType3 == null || req.body.floorType3 == '')) {

            return failure_callback(res, ['floorType3 is required', 400]);

        } else return next();
    },


    collectLook: function(req, res) { //add to shortlist collection

        var data = {};
        data.tripId = req.body.tripId,
            data.choiceType = (req.body.choiceType != undefined && req.body.choiceType != null && req.body.choiceType != '') ? req.body.choiceType.trim().toLowerCase() : '',
            data.spaceName = (req.body.spaceName != undefined && req.body.spaceName != null && req.body.spaceName != '') ? req.body.spaceName : '',
            data.spaceType = (req.body.spaceType != undefined && req.body.spaceType != null && req.body.spaceType != '') ? req.body.spaceType.trim().toLowerCase() : '',
            data.installId = (req.body.installId != undefined && req.body.installId != null && req.body.installId != '') ? req.body.installId : '',
            data.spaceCategory = (req.body.spaceCategory != undefined && req.body.spaceCategory != null && req.body.spaceCategory != '') ? req.body.spaceCategory : '',
            data.spaceL = (req.body.spaceL != undefined && req.body.spaceL != null && req.body.spaceL != '') ? req.body.spaceL : '',
            data.spaceW = (req.body.spaceW != undefined && req.body.spaceW != null && req.body.spaceW != '') ? req.body.spaceW : '',
            data.spaceH = (req.body.spaceH != undefined && req.body.spaceH != null && req.body.spaceH != '') ? req.body.spaceH : '',
            data.wallSKU1 = (req.body.wallSKU1 != undefined && req.body.wallSKU1 != null && req.body.wallSKU1 != '') ? req.body.wallSKU1 : '',
            data.wallType1 = (req.body.wallType1 != undefined && req.body.wallType1 != null && req.body.wallType1 != '') ? req.body.wallType1 : '',
            data.wallSKU2 = (req.body.wallSKU2 != undefined && req.body.wallSKU2 != null && req.body.wallSKU2 != '') ? req.body.wallSKU2 : '',
            data.wallType2 = (req.body.wallType2 != undefined && req.body.wallType2 != null && req.body.wallType2 != '') ? req.body.wallType2 : '',
            data.wallSKU3 = (req.body.wallSKU3 != undefined && req.body.wallSKU3 != null && req.body.wallSKU3 != '') ? req.body.wallSKU3 : '',
            data.wallType3 = (req.body.wallType3 != undefined && req.body.wallType3 != null && req.body.wallType3 != '') ? req.body.wallType3 : '',
            data.wallConfig = (req.body.wallConfig != undefined && req.body.wallConfig != null && req.body.wallConfig != '') ? req.body.wallConfig : '',
            data.floorSKU1 = (req.body.floorSKU1 != undefined && req.body.floorSKU1 != null && req.body.floorSKU1 != '') ? req.body.floorSKU1 : '',
            data.floorType1 = (req.body.floorType1 != undefined && req.body.floorType1 != null && req.body.floorType1 != '') ? req.body.floorType1 : '',
            data.floorSKU2 = (req.body.floorSKU2 != undefined && req.body.floorSKU2 != null && req.body.floorSKU2 != '') ? req.body.floorSKU2 : '',
            data.floorType2 = (req.body.floorType2 != undefined && req.body.floorType2 != null && req.body.floorType2 != '') ? req.body.floorType2 : '',
            data.floorSKU3 = (req.body.floorSKU3 != undefined && req.body.floorSKU3 != null && req.body.floorSKU3 != '') ? req.body.floorSKU3 : '',
            data.floorType3 = (req.body.floorType3 != undefined && req.body.floorType3 != null && req.body.floorType3 != '') ? req.body.floorType3 : '',
            data.floorConfig = (req.body.floorConfig != undefined && req.body.floorConfig != null && req.body.floorConfig != '') ? req.body.floorConfig : '',
            data.isTrial = (req.body.isTrial != undefined && req.body.isTrial != null && req.body.isTrial != '') ? req.body.isTrial : 0,
            data.roomsetId = req.body.roomSku;

        var Binaryimg = req.body.image;

        var Imagedata = Binaryimg.replace(/^data:image\/\w+;base64,/, "");
        var buf = Buffer.from(Imagedata, 'base64');

        tripModel.checkTripId(data.tripId, function(err, row) {

            if (err) return failure_callback(res, ['error in checkTripId query', 500]);
            else

            if (row == undefined || row == null || row == '') {

                return failure_callback(res, ['TripId is not valid', 500]);
            } else {

                if (row.total > 0) {

                    tripModel.getUserIdFromTripId(data.tripId, function(err, row2) {


                        if (err) return failure_callback(res, ['error in getUserIdFromCode query', 500]);
                        else

                        if (row2 == undefined || row2 == null || row2 == '') {

                            return failure_callback(res, ['TripId is not valid', 500]);
                        } else {

                            data.userId = row2.userId;

                            shortListModel.checkCollectionInShortList(data, function(err, row3) {

                                if (err) return failure_callback(res, ['Error in query', 500]);

                                else

                                if (row3[0] == 'error') {

                                    return failure_callback(res, ['Error in query', 500]);

                                } else {

                                    if (row3[3] == 1) {

                                        res.json({ status: 200, count: row3[4], message: row3[1] });

                                    } else {

                                        jimp.read(buf).then(function(img) {
                                            if (img.bitmap.width > 0 && img.bitmap.height > 0) {

                                                var ImageName = `data/trips/${data.tripId}/${Math.round(new Date().getTime()/1000)}.jpg`;

                                                data.imgurl = ImageName;

                                                img
                                                    .write(ImageName); // save

                                                shortListModel.insertCollectionToShortList(data, function(err, row3) {

                                                    if (err) {

                                                        return failure_callback(res, ['Error in query', 500]);
                                                    } else {

                                                        if (row3[0] == 'error') {
                                                            return failure_callback(res, ['Error in query', 500]);
                                                        } else {

                                                            res.json({ status: 200, count: row3[1], message: 'Collection is added in shortlist' });

                                                        }


                                                    }


                                                })

                                            } else {
                                                return failure_callback(res, ['Invalid image', 500]);
                                            }
                                        }).catch(function(err) {

                                            return failure_callback(res, [err.message, 500]);
                                        });



                                    }

                                }


                            })
                        }

                    })

                } else {

                    return failure_callback(res, ['TripId is not valid', 500]);

                }

            }

        })
    },

    getShortListByTripId: function(req, res) { //get collection shortlist

        if (req.query.tripId == undefined || req.query.tripId == '') {
            return failure_callback(res, ['tripId is required', 400]);
        }

        var data = {};
        data.tripId = req.query.tripId,
            data.installId = (req.query.installId != undefined && req.query.installId != null && req.query.installId != '') ? req.query.installId : '',
            data.trial = (req.query.trial != undefined && req.query.trial != null && req.query.trial != '') ? req.query.trial : '';


        tripModel.checkTripId(data.tripId, function(err, rowst) {

            if (err) return failure_callback(res, ['error in query', 500]);

            if (rowst == undefined || rowst == null || rowst == '') {

                return failure_callback(res, ['Trip Id not exits', 200]);

            } else {

                if (rowst.total > 0) {

                    tripModel.getUserIdFromTripId(data.tripId, function(err, row) {

                        if (err) return failure_callback(res, ['error in query', 500]);
                        else

                        if (row == undefined || row == null || row == '') {

                            return failure_callback(res, ['userId not exits against this tripId', 200]);
                        } else {

                            data.userId = row.userId;

                            shortListModel.getShortListByTrip(data, function(err, row2) {

                                if (err) return failure_callback(res, ['error in query', 500]);

                                else

                                if (row2 == undefined || row2 == null || row2 == '') {

                                    return failure_callback(res, ['No record found', 200]);
                                } else {

                                    let Datasarray = {};
                                    let spnameArray = [];
                                    let t = 0;

                                    row2[1].forEach(srow => {


                                        getData(srow.wallType1, srow.wallSKU1).then(function(datal) {

                                                if (datal != null && datal != '') {
                                                    srow.wallSKU1 = datal;
                                                } else {

                                                    srow.wallSKU1 = {};

                                                }

                                                getData(srow.wallType2, srow.wallSKU2).then(function(data2) {

                                                        if (data2 != null && data2 != '') {
                                                            srow.wallSKU2 = data2;
                                                        } else {

                                                            srow.wallSKU2 = {};

                                                        }

                                                        getData(srow.wallType3, srow.wallSKU3).then(function(data3) {

                                                                if (data3 != null && data3 != '') {
                                                                    srow.wallSKU3 = data3;
                                                                } else {

                                                                    srow.wallSKU3 = {};

                                                                }

                                                                getData(srow.floorType1, srow.floorSKU1).then(function(data4) {

                                                                        if (data4 != null && data4 != '') {
                                                                            srow.floorSKU1 = data4;
                                                                        } else {

                                                                            srow.floorSKU1 = {};

                                                                        }

                                                                        getData(srow.floorType2, srow.floorSKU2).then(function(data5) {

                                                                                if (data5 != null && data5 != '') {
                                                                                    srow.floorSKU2 = data5;
                                                                                } else {

                                                                                    srow.floorSKU2 = {};

                                                                                }

                                                                                getData(srow.floorType3, srow.floorSKU3).then(function(data6) {

                                                                                        if (data6 != null && data6 != '') {
                                                                                            srow.floorSKU3 = data6;
                                                                                        } else {

                                                                                            srow.floorSKU3 = {};

                                                                                        }


                                                                                        if (spnameArray.includes(srow.spaceName)) {

                                                                                            Datasarray[srow.spaceName].push(srow);

                                                                                        } else {

                                                                                            spnameArray.push(srow.spaceName);

                                                                                            Datasarray[srow.spaceName] = [];
                                                                                            Datasarray[srow.spaceName].push(srow);
                                                                                        }

                                                                                        t++;

                                                                                        if (row2[1].length == t) {

                                                                                            res.json({ status: 200, onTrial: row2[0], data: Datasarray, message: 'collections in shortlist' });
                                                                                        }

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
                                }

                            })
                        }

                    })

                } else {


                    return failure_callback(res, ['TripId is not active, Please create new trip and add collection', 200]);

                }
            }

        })


    },


    getCollectionDetailByTripId: function(req, res) {

        if (req.query.tripId == undefined || req.query.tripId == '') {
            return failure_callback(res, ['tripId is required', 400]);
        } else if (req.query.Id == undefined || req.query.Id == '') {

            return failure_callback(res, ['Id is required to get collection detail from shortlist', 400]);

        } else

            var data = {};
        data.tripId = req.query.tripId,
            data.Id = req.query.Id;

        tripModel.checkTripId(data.tripId, function(err, rowst) {

            if (err) return failure_callback(res, ['error in query', 500]);

            if (rowst == undefined || rowst == null || rowst == '') {

                return failure_callback(res, ['Trip Id not exits', 200]);

            } else {

                if (rowst.total > 0) {

                    tripModel.getUserIdFromTripId(data.tripId, function(err, row) {

                        if (err) return failure_callback(res, ['error in query', 500]);
                        else

                        if (row == undefined || row == null || row == '') {

                            return failure_callback(res, ['userId not exits against this tripId', 200]);
                        } else {

                            data.userId = row.userId;

                            shortListModel.getCollectionDetailByTripId(data, function(err, row2) {

                                if (err) return failure_callback(res, ['error in query', 500]);

                                else

                                if (row2 == undefined || row2 == null || row2 == '') {

                                    return failure_callback(res, ['No record found', 200]);
                                } else {

                                    var lookArray = {};

                                    lookArray.id = row2.id;
                                    lookArray.roomsetId = row2.roomsetId;
                                    lookArray.spaceName = row2.spaceName;
                                    lookArray.priceCategory = row2.priceCategory;
                                    lookArray.spaceType = row2.spaceType;

                                    lookArray.spaceCategory = row2.spaceCategory;
                                    lookArray.spaceL = row2.spaceL;
                                    lookArray.spaceW = row2.spaceW;
                                    lookArray.spaceH = row2.spaceH;
                                    lookArray.wallConfig = row2.wallConfig;
                                    lookArray.floorConfig = row2.floorConfig;
                                    lookArray.collectionImage = row2.image;

                                    getData(row2.wallType1, row2.wallSKU1).then(function(datal) {

                                            if (datal != null && datal != '') {
                                                datal['type'] = row2.wallType1;
                                                lookArray.wallSKU1 = datal;
                                            } else {

                                                lookArray.wallSKU1 = {};

                                            }

                                            getData(row2.wallType2, row2.wallSKU2).then(function(data2) {

                                                    if (data2 != null && data2 != '') {
                                                        data2['type'] = row2.wallType2;
                                                        lookArray.wallSKU2 = data2;
                                                    } else {

                                                        lookArray.wallSKU2 = {};

                                                    }

                                                    getData(row2.wallType3, row2.wallSKU3).then(function(data3) {

                                                            if (data3 != null && data3 != '') {
                                                                data3['type'] = row2.wallType3;
                                                                lookArray.wallSKU3 = data3;
                                                            } else {

                                                                lookArray.wallSKU3 = {};

                                                            }

                                                            getData(row2.floorType1, row2.floorSKU1).then(function(data4) {

                                                                    if (data4 != null && data4 != '') {
                                                                        data4['type'] = row2.floorType1;
                                                                        lookArray.floorSKU1 = data4;
                                                                    } else {

                                                                        lookArray.floorSKU1 = {};

                                                                    }

                                                                    getData(row2.floorType2, row2.floorSKU2).then(function(data5) {

                                                                            if (data5 != null && data5 != '') {
                                                                                data5['type'] = row2.floorType2;
                                                                                lookArray.floorSKU2 = data5;
                                                                            } else {

                                                                                lookArray.floorSKU2 = {};

                                                                            }

                                                                            getData(row2.floorType3, row2.floorSKU3).then(function(data6) {

                                                                                    if (data6 != null && data6 != '') {
                                                                                        data6['type'] = row2.floorType3;
                                                                                        lookArray.floorSKU3 = data6;
                                                                                    } else {

                                                                                        lookArray.floorSKU3 = {};

                                                                                    }

                                                                                    res.json({ status: 200, data: lookArray, message: 'collection detail' });

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
                                }

                            })
                        }

                    })

                } else {


                    return failure_callback(res, ['TripId is in invalid', 200]);

                }
            }

        })


    },


    deleteCollectionFromShortList: function(req, res) {

        if (req.query.tripId == undefined || req.query.tripId == '') {
            return failure_callback(res, ['tripId is required', 400]);
        } else if (req.query.Id == undefined || req.query.Id == '') {

            return failure_callback(res, ['Id is required to delete the collection from shortlist', 400]);

        } else

            var data = {};
        data.tripId = req.query.tripId,
            data.Id = req.query.Id;

        tripModel.checkTripId(data.tripId, function(err, rowst) {

            if (err) return failure_callback(res, ['error in query', 500]);

            if (rowst == undefined || rowst == null || rowst == '') {

                return failure_callback(res, ['Trip Id not exits', 200]);

            } else {

                if (rowst.total > 0) {

                    tripModel.getUserIdFromTripId(data.tripId, function(err, row) {

                        if (err) return failure_callback(res, ['error in query', 500]);
                        else

                        if (row == undefined || row == null || row == '') {

                            return failure_callback(res, ['userId not exits against this tripId', 200]);
                        } else {

                            data.userId = row.userId;

                            shortListModel.deleteCollectionShortList(data, function(err, row2) {

                                if (err) return failure_callback(res, ['error in query', 500]);

                                else

                                if (row2 == undefined || row2 == null || row2 == '') {

                                    return failure_callback(res, ['No record found', 200]);
                                } else {

                                    if (row2[0] == 'error') {

                                        return failure_callback(res, [row2[1], row2[2]]);
                                    } else {

                                        res.json({ status: 200, message: row2[1] });

                                    }
                                }

                            })
                        }

                    })

                } else {


                    return failure_callback(res, ['TripId is in invalid', 200]);

                }
            }

        })


    },

    addOrRemoveCollectionFromTrail: function(req, res) {

        if (req.body.tripId == undefined || req.body.tripId == '') {
            return failure_callback(res, ['tripId is required', 400]);
        } else if (req.body.Id == undefined || req.body.Id == '') {

            return failure_callback(res, ['Id is required to add or remove the collection on trial', 400]);

        } else

            var data = {};
        data.tripId = req.body.tripId,
            data.Id = req.body.Id,
            data.delete = (req.body.delete != undefined && req.body.delete != null && req.body.delete != '') ? 1 : 0;

        tripModel.checkTripId(data.tripId, function(err, rowst) {

            if (err) return failure_callback(res, ['error in query', 500]);

            if (rowst == undefined || rowst == null || rowst == '') {

                return failure_callback(res, ['Trip Id not exits', 200]);

            } else {

                if (rowst.total > 0) {

                    tripModel.getUserIdFromTripId(data.tripId, function(err, row) {

                        if (err) return failure_callback(res, ['error in query', 500]);
                        else

                        if (row == undefined || row == null || row == '') {

                            return failure_callback(res, ['userId not exits against this tripId', 200]);
                        } else {

                            data.userId = row.userId;

                            console.log('+++++++++++++++++++++++++++');
                            console.log(data);

                            shortListModel.addOrRemoveCollectionFromTrailShortList(data, function(err, row2) {

                                if (err) return failure_callback(res, ['error in query', 500]);

                                else

                                if (row2 == undefined || row2 == null || row2 == '') {

                                    return failure_callback(res, ['No record found', 200]);
                                } else {

                                    if (row2[0] == 'error') {

                                        return failure_callback(res, [row2[1], row2[2]]);
                                    } else {

                                        res.json({ status: 200, message: row2[1] });

                                    }
                                }

                            })
                        }

                    })

                } else {


                    return failure_callback(res, ['TripId is in invalid', 200]);

                }
            }

        })


    },

}




function getData(type, sku) {

    // console.log('In getData function');

    return new Promise((resolve, reject) => {

        if (type == null || type == '' || sku == null || sku == '') {

            console.log('iam in null case');

            resolve([]);

        } else {

            productModel.getSkuDetailForShortList({ type: type, sku: sku }, function(err, rows1) {
                if (err) reject();

                else

                    resolve(rows1);

            })
        }

    })

}