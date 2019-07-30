var dataDb = require('../database'),
    fs = require('fs');
let db = dataDb.connectDatabase();
let db2 = dataDb.connectUserDatabase();

module.exports = {

    checkCollectionInShortList: function(data, callback) {

        let selQuery = `SELECT count(*) as total FROM shortlistMaster WHERE userId = '${data.userId}' AND tripId = '${data.tripId}' AND installId = '${data.installId}' 
        
        AND choiceType = '${data.choiceType}' AND spaceType = '${data.spaceType}' AND wallSKU1 = '${data.wallSKU1}' AND wallSKU2 = '${data.wallSKU2}'
        
        AND wallSKU3 = '${data.wallSKU3}' AND floorSKU1 = '${data.floorSKU1}' AND floorSKU2 = '${data.floorSKU2}' AND floorSKU3 = '${data.floorSKU3}'`;

        db2.get(selQuery, [], function(err, row) {

            if (err) {

                return callback(null, ['error', 'error in query', 400, 1]);

            } else {

                if (row.total > 0) {

                    db2.get(`SELECT count(*) as total FROM shortlistMaster WHERE userId = '${data.userId}' AND tripId = '${data.tripId}' AND installId = '${data.installId}'`, [], function(err, row2) {

                        if (err) {
                            return callback(null, ['success', 'This collection is allready in shortlist', 200, 1, 0]);

                        } else {

                            return callback(null, ['success', 'This collection is allready in shortlist', 200, 1, row2.total]);

                        }


                    })



                } else {

                    return callback(null, ['success', '', 200, 0]);
                }

            }

        })

    },


    insertCollectionToShortList: function(data, callback) {

        let query = `INSERT INTO shortlistMaster (userId,tripId,installId,choiceType,spaceName,spaceType,spaceCategory,spaceL,spaceW,spaceH,roomsetId,wallType1,wallSKU1,wallType2,wallSKU2,
            
                        wallType3,wallSKU3,wallConfig,floorType1,floorSKU1,floorType2,floorSKU2,floorType3,floorSKU3,floorConfig,image,isTrial)`;

        query += `VALUES ('${data.userId}','${data.tripId}','${data.installId}','${data.choiceType}','${data.spaceName}','${data.spaceType}','${data.spaceCategory}','${data.spaceL}','${data.spaceW}',
                    
                    '${data.spaceH}','${data.roomsetId}','${data.wallType1}','${data.wallSKU1}','${data.wallType2}','${data.wallSKU2}','${data.wallType3}','${data.wallSKU3}',
                    
                    '${data.wallConfig}','${data.floorType1}','${data.floorSKU1}','${data.floorType2}','${data.floorSKU2}','${data.floorType3}','${data.floorSKU3}','${data.floorConfig}',
            
                    '${data.imgurl}', '${data.isTrial}')`;

        console.log(query);

        db2.run(query, [], function(err, row) {

            if (err) {

                return callback(null, ['error', 500]);

            } else {


                db2.get(`SELECT count(*) as total FROM shortlistMaster WHERE userId = '${data.userId}' AND tripId = '${data.tripId}' AND installId = '${data.installId}'`, [], function(err, row2) {

                    if (err) {
                        return callback(null, ['success', 0]);

                    } else {

                        return callback(null, ['success', row2.total]);

                    }


                })

            }



        })



    },

    getShortListByTrip: function(data, callback) {

        let install = (data.installId != undefined && data.installId != null && data.installId != '') ? ` AND installId = '${data.installId}'` : '';
        let trial = (data.trial != undefined && data.trial != null && data.trial != '' && data.trial != 0) ? ` AND isTrial = 1` : '';

        let query = `SELECT id,spaceName,spaceCategory,spaceL,spaceW,spaceH,wallType1,wallSKU1,wallType2,wallSKU2,wallType3,wallSKU3,floorType1,
        floorSKU1,floorType2,floorSKU2,floorType3,floorSKU3,image,isTrial FROM shortlistMaster WHERE userId = '${data.userId}' AND tripId = '${data.tripId}'${install}${trial}`;

        db2.all(query, [], function(err, rows) {

            if (err) return callback(null, '');

            else

                db2.get(`SELECT count(*) as total FROM shortlistMaster WHERE userId = '${data.userId}' AND tripId = '${data.tripId}'${install} AND isTrial = 1`, [], function(err, row) {

                if (err) return callback(null, '');

                else

                    return callback(null, [row.total, rows]);
            })

        });

    },

    deleteCollectionShortList: function(data, callback) {

        let query = `SELECT count(*) as total, image FROM shortlistMaster WHERE id = '${data.Id}' AND userId = '${data.userId}' AND tripId = '${data.tripId}'`;

        db2.get(query, [], function(err, row) {

            if (err) {

                return callback(null, ['error', 'error in select query', 400, 0]);

            } else {

                if (row.total > 0) {

                    db2.run(`DELETE FROM shortlistMaster WHERE id = ?`, [data.Id], function() {

                        if (err) return callback(null, ['error', 'error in delete query', 400, 0]);

                        else

                            fs.unlink(`${row.image}`, function(err) {

                            console.log('File deleted!');
                        });


                        return callback(null, ['success', 'collection is deleted from shortlist', 200, 1]);

                    })

                } else {

                    return callback(null, ['error', 'Id is not exist with this tripId', 200, 0]);
                }

            }


        })

    },


    getCollectionDetailByTripId: function(data, callback) {

        let query = `SELECT id,roomsetId,spaceName,spaceType,spaceCategory,spaceL,spaceW,spaceH,
        
        wallType1,wallSKU1,wallType2,wallSKU2,wallType3,wallSKU3,wallConfig,floorType1,floorSKU1,floorType2,floorSKU2,floorType3,floorSKU3,floorConfig,image
        FROM shortlistMaster WHERE id = '${data.Id}' AND userId = '${data.userId}' AND tripId = '${data.tripId}'`;

        db2.get(query, [], callback);

    },


    addOrRemoveCollectionFromTrailShortList: function(data, callback) {

        let query = `SELECT count(*) as total FROM shortlistMaster WHERE id = '${data.Id}' AND userId = '${data.userId}' AND tripId = '${data.tripId}'`;

        db2.get(query, [], function(err, row) {

            if (err) {

                return callback(null, ['error', 'error in select query', 400, 0]);

            } else {

                if (row.total > 0) {

                    if (data.delete > 0) {

                        db2.run(`UPDATE shortlistMaster SET isTrial = 1 WHERE id = ?`, [data.Id], function(err, res) {

                            if (err) return callback(null, ['error', 'error in select query', 400, 0]);

                            else

                                return callback(null, ['success', 'collection is added into trial', 200, 1]);

                        });


                    } else {

                        db2.run(`UPDATE shortlistMaster SET isTrial = 0 WHERE id = ?`, [data.Id], function(err, res) {

                            if (err) return callback(null, ['error', 'error in select query', 400, 0]);

                            else

                                return callback(null, ['success', 'collection is removed from trial', 200, 1]);

                        });

                    }

                } else {

                    return callback(null, ['error', 'Id is not exist with this tripId', 200, 0]);
                }

            }


        })

    },




}