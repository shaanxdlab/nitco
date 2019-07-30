var db = require('../database');

module.exports = {


    getFilterList: function(type, callback) {

        let query = `SELECT  distinct d.value ,d.unit FROM tileMaster t LEFT JOIN  tileDetailMaster d ON d.sku=t.sku where `;

        if (type == 'mrp') query += `d.head='details' AND d.name='MRP' and d.value!='' AND `;
        else if (type == 'size') query += `d.head='details' AND d.name='Size' and d.value!='' AND `;
        else if (type == 'spaces') query += `d.head='suitable_spaces' and d.value!='' AND `;
        else if (type == 'colour') query += `d.head='details' AND d.name='Colour' and d.value!='' AND `;
        else if (type == 'price') query = `SELECT max(d.value) as maxPrice, min(d.value) as minPrice FROM tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku where  d.name = 'MRP' AND `;
        else if (type == 'material') query += `d.head='details' AND d.name='Material' and d.value!='' AND `;
        else if (type == 'properties') query += `d.head='properties' AND d.value!='' AND `;
        query += `t.isActive = ?`;

        console.log(query);

        return db.all(query, [1], callback);

    },

    getLooksList: function(data, callback) {

        console.log(data[1]);

        var space = data[0].space.toLowerCase().trim(),
            surface = data[0].surface.toLowerCase().trim(),
            size = data[0].space_size.toUpperCase().trim(),
            price_range = data[0].price_range.trim(),
            offsets = data[0].offset;


        var keyword = data[0].keyword;

        var spaces = (space != '' && space != 'all') ? ` spaces = '${space}' AND ` : '',
            surfaces = (surface != '' && surface != 'all') ? ` surfaces = '${surface}' AND ` : '',
            space_size = (data[0].space_size != '' && data[0].space_size != 'all') ? ` space_size = '${size}' AND ` : '',
            price = (price_range != '' && price_range != 'all') ? ` priceCategory = '${price_range}' AND ` : '',
            offset = (offsets != '' && offsets != 'all') ? `LIMIT ${data[0].limit} OFFSET ${offsets}` : `LIMIT ${data[0].limit} OFFSET 0`;


        let countQuery = `SELECT count(*) as total FROM lookMaster `;
        let query = `SELECT sku, name, numViews FROM lookMaster `;

        if (keyword != '' && keyword != null) {
            keyquery = ` WHERE (name LIKE '%${keyword}%' OR spaces LIKE '%${keyword}%' OR surfaces LIKE '%${keyword}%' OR priceCategory LIKE '%${keyword}%') AND `;

            query += keyquery;
            countQuery += keyquery;

        } else {
            keyquery = ` WHERE ${spaces}${surfaces}${price}${space_size} `;
            query += keyquery;
            countQuery += keyquery;
        }

        query += `type = 0 AND isActive = 1 ${offset}`;

        countQuery += `type = 0 AND isActive = 1`;

        console.log(query);

        if (data[1] == 0) {

            return db.all(query, [], callback);
        } else {
            return db.get(countQuery, [], callback);
        }

    },
    getLookDetail: function(sku, callback) {

        console.log(sku);

        db.run(`UPDATE lookMaster SET numViews = numViews + 1 WHERE sku = ?`, [sku]);

        let query = `SELECT sku,name,description,wallType1,wallType2,wallType3,floorType1,floorType2,floorType3,wallSKU1,wallSKU2,wallSKU3,`;
        query += `floorSKU1,floorSKU2,floorSKU3,priceCategory,numViews `;
        query += `FROM lookMaster WHERE isActive = ? AND sku = ?`;

        // console.log(query);

        return db.get(query, [1, sku], callback);


    },

    getSkuDetail: function(data, callback) {

        let query = '';

        if (data.type != null && data.type != '') {

            if (data.type == 'tile') {
                query = `SELECT t.sku, t.name, t.collection, d.value as Length, k.value as width, d.unit, t.isWall, t.isFloor FROM tileMaster `;
                query += `t LEFT JOIN  tileDetailMaster d ON d.sku=t.sku LEFT JOIN tileDetailMaster k ON k.sku=t.sku `;
                query += `WHERE t.sku = ? AND t.isActive = ? AND d.head = 'details' AND d.name = 'Length' AND k.head = 'details' AND k.name = 'Width' `;
            } else if (data.type == 'marble') {

                query = `SELECT t.sku, t.name, t.collection, d.value as Length, k.value as width, d.unit, t.isWall, t.isFloor FROM stoneMaster `;
                query += `t LEFT JOIN  stoneDetailMaster d ON d.sku=t.sku LEFT JOIN stoneDetailMaster k ON k.sku=t.sku `;
                query += `WHERE t.sku = ? AND t.isActive = ? AND d.head = 'details' AND d.name = 'Length' AND k.head = 'details' AND k.name = 'Width' `;
            } else {
                query = `SELECT t.sku, t.name, t.collection, d.value as Length, k.value as width, d.unit, t.isWall, t.isFloor FROM tileMaster `;
                query += `t LEFT JOIN  tileDetailMaster d ON d.sku=t.sku LEFT JOIN tileDetailMaster k ON k.sku=t.sku `;
                query += `WHERE t.sku = ? AND t.isActive = ? AND d.head = 'details' AND d.name = 'Length' AND k.head = 'details' AND k.name = 'Width' `;
            }


            console.log(query);

            return db.get(query, [data.sku, 1], callback);

        } else {

            return callback(false);

        }


    },


    getSimilarLooksList: function(sku, callback) {

        let query = `SELECT GROUP_CONCAT(DISTINCT sku) as sku FROM lookMaster WHERE spaces = (SELECT spaces FROM lookMaster WHERE sku = '${sku}')  `;
        query += `AND space_size = (SELECT space_size FROM lookMaster WHERE sku = '${sku}')  `
        query += `AND priceCategory = (SELECT priceCategory FROM lookMaster WHERE sku = '${sku}') `;
        query += `AND sku!='${sku}' AND type = 0 ORDER BY numViews DESC LIMIT 12`;

        console.log(query);

        return db.all(query, [], callback);


    },

    getStylesList: function(data, callback) {

        console.log(data[1]);

        var space = data[0].space.toLowerCase().trim(),
            surface = data[0].surface.toLowerCase().trim(),
            size = data[0].space_size.toUpperCase().trim(),
            price_range = data[0].price_range.trim(),
            offsets = data[0].offset;


        var keyword = data[0].keyword;

        var spaces = (space != '' && space != 'all') ? ` spaces = '${space}' AND ` : '',
            surfaces = (surface != '' && surface != 'all') ? ` surfaces = '${surface}' AND ` : '',
            space_size = (data[0].space_size != '' && data[0].space_size != 'all') ? ` space_size = '${size}' AND ` : '',
            price = (price_range != '' && price_range != 'all') ? ` priceCategory = '${price_range}' AND ` : '',
            offset = (offsets != '' && offsets != 'all') ? `LIMIT ${data[0].limit} OFFSET ${offsets}` : `LIMIT ${data[0].limit} OFFSET 0`;


        let countQuery = `SELECT count(*) as total FROM lookMaster `;
        let query = `SELECT sku, name, numViews FROM lookMaster `;

        if (keyword != '' && keyword != null) {
            keyquery = ` WHERE (name LIKE '%${keyword}%' OR spaces LIKE '%${keyword}%' OR surfaces LIKE '%${keyword}%' OR priceCategory LIKE '%${keyword}%') AND `;

            query += keyquery;
            countQuery += keyquery;

        } else {
            keyquery = ` WHERE ${spaces}${surfaces}${price}${space_size} `;
            query += keyquery;
            countQuery += keyquery;
        }

        query += `type = 1 AND isActive = 1 ${offset}`;

        countQuery += `type = 1 AND isActive = 1`;


        console.log(query);

        if (data[1] == 0) {

            return db.all(query, [], callback);
        } else {
            return db.get(countQuery, [], callback);
        }

    },

    getSimilarStylesList: function(sku, callback) {

        let query = `SELECT GROUP_CONCAT(DISTINCT sku) as sku FROM lookMaster WHERE spaces = (SELECT spaces FROM lookMaster WHERE sku = '${sku}')  `;
        query += `AND space_size = (SELECT space_size FROM lookMaster WHERE sku = '${sku}')  `
        query += `AND priceCategory = (SELECT priceCategory FROM lookMaster WHERE sku = '${sku}') `;
        query += `AND sku!='${sku}' AND type = 1 ORDER BY numViews DESC LIMIT 12`;

        console.log(query);

        return db.all(query, [], callback);


    },

}