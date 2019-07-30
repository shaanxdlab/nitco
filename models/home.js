var db = require('../database');

module.exports = {

    getRoomsList: function(data, callback) {

        var type = data.type.toUpperCase().trim(),
            size = data.size.toUpperCase().trim(),
            qr = '';


        if (type != 'ALL' && size == 'ALL') {
            qr = `space = '${type}' AND`;
        } else if (type != 'ALL' && size != 'ALL') {

            qr = `space = '${type}' AND category = '${size}' AND`;
        }

        query = `SELECT room as sku,name,category AS size FROM roomsetMaster WHERE ${qr} isActive = ?`;

        console.log(query);

        return db.all(query, [1], callback);

    },
    getFilterList: function(data, callback) {

        console.log(data.type);

        var table = data.table.toLowerCase().trim(),
            type = data.type.toLowerCase().trim();

        let query = '';

        if (table == 'products' || table == 'product') {
            query = `SELECT distinct d.value, d.unit FROM tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku where `;

            if (type == 'spaces') query += `d.head='suitable_spaces' and d.value!='' AND `;
            else if (type == 'surfaces') query += `d.head='application' and d.value!='' AND `;
            else if (type == 'colour') query += `d.head='details' AND d.name='Colour' and d.value!='' AND `;
            else if (type == 'price_range') query = `SELECT max(d.value) as maxPrice, min(d.value) as minPrice FROM tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku where  d.name = 'MRP' AND `;
            else if (type == 'product_size') {

                query = `SELECT distinct (d.value || ' x ' || k.value || ' ' ||  d.unit) as value FROM tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku LEFT JOIN tileDetailMaster k ON k.sku=t.sku where `;
                query += `d.head='details' AND d.name='Length' and d.value!='' AND k.head='details' AND k.name='Width' and k.value!='' AND `;


            } else if (type == 'material') query += `d.head='details' AND d.name='Material' and d.value!='' AND `;
            else if (type == 'properties') query += `d.head='properties' AND d.value!='' AND `;

            query += `t.isActive = 1`;


        } else if (table == 'looks' || table == 'look') {
            if (type == 'spaces') {
                query += `SELECT DISTINCT (upper(substr(spaces, 1,1)) || substr(spaces, 2)) as value FROM lookMaster WHERE type = 0 AND isActive = 1`;
            } else if (type == 'surfaces') {
                query += `SELECT DISTINCT (upper(substr(surfaces, 1,1)) || substr(surfaces, 2)) as value FROM lookMaster WHERE type = 0 AND  isActive = 1`;
            } else if (type == 'price_range') {
                query += `SELECT DISTINCT (upper(substr(priceCategory, 1,1)) || substr(priceCategory, 2)) as value FROM lookMaster WHERE type = 0 AND  isActive = 1 `;
            } else if (type == 'space_size') {
                query += `SELECT DISTINCT space_size as value FROM lookMaster WHERE type = 0 AND  isActive = 1 `;
            } else if (type == 'colour') {

                query += `SELECT DISTINCT colour as value FROM lookMaster WHERE type = 0 AND  isActive = 1 `;
            } else if (type == 'properties') {


                query += `SELECT distinct d.value FROM tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku where d.head='properties' AND d.value!='' AND t.isActive = 1

                union 
                
                SELECT distinct d.value FROM stoneMaster s LEFT JOIN stoneDetailMaster d ON d.sku=s.sku where d.head='properties' AND d.value!='' AND s.isActive = 1`;
            }


        }

        console.log(query);

        return db.all(query, [], callback);

    },


    tgetSkuTable: function(sku, callback) {

        db.get(`SELECT count(*) as total FROM lookMaster WHERE sku = ?`, [sku], (err, Lrow) => {
            if (err) {
                console.error(err.message);
            }

            if (Lrow.total > 0) {

                console.log('Iam in looksMaster table');

                return callback(null, Lrow.total);

            }
        });

        // return callback(null, 'hello iam here');

    },




    getSkuTable: function(sku, callback) {

        db.get(`SELECT count(*) as total FROM lookMaster WHERE sku = ?`, [sku], (err, Lrow) => {
            if (err) {
                console.error(err.message);
            }

            if (Lrow.total > 0) {


                callback(null, 'lookMaster');
                return;

            } else {

                db.get(`SELECT count(*) as total FROM tileMaster WHERE sku = ?`, [sku], (err, Trow) => {
                    if (err) {
                        return console.error(err.message);
                    }

                    if (Trow.total > 0) {

                        return callback(null, 'tileMaster');

                    } else {


                        db.get(`SELECT count(*) as total FROM stoneMaster WHERE sku = ?`, [sku], (err, Srow) => {
                            if (err) {
                                return console.error(err.message);
                            }

                            if (Srow.total > 0) {

                                return callback(null, 'stoneMaster');

                            } else {

                                db.get(`SELECT count(*) as total FROM mossacMaster WHERE sku = ?`, [sku], (err, Mrow) => {
                                    if (err) {
                                        return console.error(err.message);
                                    }

                                    if (Mrow.total > 0) {

                                        return callback(null, 'mossacMaster');

                                    } else {

                                        return callback(null, 0);
                                    }

                                });

                            }


                        });

                    }


                });

            }

        });

    },

    getLookSKUsList: function(sku, callback) {

        let query = `select GROUP_CONCAT(DISTINCT sku) as sku FROM lookMaster WHERE wallSKU1 = '${sku}' OR wallSKU2 = '${sku}' `;
        query += `OR wallSKU3 = '${sku}' OR  floorSKU1 = '${sku}' OR floorSKU2 = '${sku}' OR floorSKU3 = '${sku}'`;

        return db.all(query, [], callback);

    }
}