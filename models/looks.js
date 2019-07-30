var dataDb = require('../database');
let db = dataDb.connectDatabase();

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

        var space = data.space.trim(),
            surface = data.surface.toLowerCase().trim(),
            Size = data.space_size.toLowerCase().trim(),
            price_range = data.price_range.trim(),
            offsets = data.offset;

        let size = Size.charAt(0).toUpperCase() + Size.slice(1);

        var keyword = data.keyword;

        var spaces = (space != '' && space != 'all') ? ` spaces = '${space.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })}' AND ` : '',
            surfaces = (surface != '' && surface != 'all') ? ` surfaces = '${surface}' AND ` : '',
            space_size = (data.space_size != '' && data.space_size != 'all') ? ` space_size = '${size}' AND ` : '',
            price = (price_range != '' && price_range != 'all') ? ` priceCategory = '${price_range}' AND ` : '',
            offset = (offsets != '' && offsets != 'all') ? `LIMIT ${data.limit} OFFSET ${offsets}` : `LIMIT ${data.limit} OFFSET 0`;

        if (keyword != '' && keyword != null) {
            filter = ` WHERE (name LIKE '%${keyword}%' OR spaces LIKE '%${keyword}%' OR surfaces LIKE '%${keyword}%' OR priceCategory LIKE '%${keyword}%') AND `;

        } else {
            filter = ` WHERE ${spaces}${surfaces}${price}${space_size} `;
        }

        let query = `SELECT sku, name, numViews, (SELECT count(*) as total FROM lookMaster ${filter} type = 0 AND isActive = 1) as total FROM lookMaster`;

        query += `${filter} type = 0 AND isActive = 1 ${offset}`;

        console.log(query);

        return db.all(query, [], callback);

    },
    getLookDetail: function(sku, callback) {

        // console.log(sku);

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
                query = `SELECT t.sku, t.name, t.collection,

                (select value from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Width') as width,
                
                (select value from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Height') as height,
                
                 (select value from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Thickness') as thickness,
                 
                 (select unit from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Thickness') as unit,
                 
                 t.isWall, t.isFloor FROM tileMaster t 
                
                WHERE t.sku = '${data.sku}' AND t.isActive = 1;`;


            } else if (data.type == 'marble') {

                query = `SELECT t.sku, t.name, t.category as collection,

                (select value from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Width') as width,
                
                (select value from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Height') as height,
                
                 (select value from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Thickness') as thickness,
                 
                 (select unit from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Thickness') as unit,
                 
                 t.isWall, t.isFloor FROM stoneMaster t 
                
                WHERE t.sku = '${data.sku}' AND t.isActive = 1;`;


            } else {


                query = `SELECT t.sku, t.name, t.collection, d.value as height, k.value as width, d.unit, t.isWall, t.isFloor FROM tileMaster `;
                query += `t LEFT JOIN  tileDetailMaster d ON d.sku=t.sku LEFT JOIN tileDetailMaster k ON k.sku=t.sku `;
                query += `WHERE t.sku = '${data.sku}' AND t.isActive = 1 AND d.head = 'details' AND d.name = 'Height' AND k.head = 'details' AND k.name = 'Width' `;


            }


            console.log(query);

            return db.get(query, [], callback);

        } else {

            return callback([]);

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

        var space = data.space.trim(),
            surface = data.surface.toLowerCase().trim(),
            Size = data.space_size.toLowerCase().trim(),
            price_range = data.price_range.trim(),
            offsets = data.offset;

        let size = Size.charAt(0).toUpperCase() + Size.slice(1);

        var keyword = data.keyword;

        var spaces = (space != '' && space != 'all') ? ` spaces = '${space.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })}' AND ` : '',
            surfaces = (surface != '' && surface != 'all') ? ` surfaces = '${surface}' AND ` : '',
            space_size = (data.space_size != '' && data.space_size != 'all') ? ` space_size = '${size}' AND ` : '',
            price = (price_range != '' && price_range != 'all') ? ` priceCategory = '${price_range}' AND ` : '',
            offset = (offsets != '' && offsets != 'all') ? `LIMIT ${data.limit} OFFSET ${offsets}` : `LIMIT ${data.limit} OFFSET 0`;

        if (keyword != '' && keyword != null) {
            filter = ` WHERE (name LIKE '%${keyword}%' OR spaces LIKE '%${keyword}%' OR surfaces LIKE '%${keyword}%' OR priceCategory LIKE '%${keyword}%') AND `;

        } else {
            filter = ` WHERE ${spaces}${surfaces}${price}${space_size} `;
        }

        let query = `SELECT sku, name, numViews, (SELECT count(*) as total FROM lookMaster ${filter} type = 1 AND isActive = 1) as total FROM lookMaster`;

        query += `${filter} type = 1 AND isActive = 1 ${offset}`;

        console.log(query);

        return db.all(query, [], callback);

    },

    getSimilarStylesList: function(sku, callback) {

        let query = `SELECT GROUP_CONCAT(DISTINCT sku) as sku FROM lookMaster WHERE spaces = (SELECT spaces FROM lookMaster WHERE sku = '${sku}')  `;
        query += `AND space_size = (SELECT space_size FROM lookMaster WHERE sku = '${sku}')  `
        query += `AND priceCategory = (SELECT priceCategory FROM lookMaster WHERE sku = '${sku}') `;
        query += `AND sku!='${sku}' AND type = 1 ORDER BY numViews DESC LIMIT 12`;

        console.log(query);

        return db.all(query, [], callback);


    },


    getSkuDetailForShortList: function(data, callback) {

        let query = '';

        if (data.type != null && data.type != '') {

            if (data.type == 'tile') {
                query = `SELECT t.sku, t.name,
                
                (select value from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Box Size') as box,
                (select unit from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Box Size') as boxUnit,

                (select unit from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Coverage') as coverage,
                (select value from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Coverage') as coverageUnit,
                (select package from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Coverage') as coveragePackage,

                (select value from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name IN('MRP','mrp','Mrp')) as mrp,
                (select unit from tileDetailMaster where sku = '${data.sku}' AND head = 'details' AND name IN('MRP','mrp','Mrp')) as mrpUnit,
                 
                 t.isWall, t.isFloor FROM tileMaster t 
                
                WHERE t.sku = '${data.sku}' AND t.isActive = 1;`;


            } else if (data.type == 'marble') {

                query = `SELECT t.sku, t.name,

                (select value from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Box Size') as box,
                (select unit from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Box Size') as boxUnit,

                (select unit from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Coverage') as coverage,
                (select value from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Coverage') as coverageUnit,
                (select package from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name = 'Coverage') as coveragePackage,

                (select value from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name IN('MRP','mrp','Mrp')) as mrp,
                (select unit from stoneDetailMaster where sku = '${data.sku}' AND head = 'details' AND name IN('MRP','mrp','Mrp')) as mrpUnit,
                 
                 t.isWall, t.isFloor FROM stoneMaster t 
                
                WHERE t.sku = '${data.sku}' AND t.isActive = 1;`;


            } else {


                query = `SELECT t.sku, t.name, t.collection, d.value as height, k.value as width, d.unit, t.isWall, t.isFloor FROM tileMaster `;
                query += `t LEFT JOIN  tileDetailMaster d ON d.sku=t.sku LEFT JOIN tileDetailMaster k ON k.sku=t.sku `;
                query += `WHERE t.sku = '${data.sku}' AND t.isActive = 1 AND d.head = 'details' AND d.name = 'Height' AND k.head = 'details' AND k.name = 'Width' `;


            }


            // console.log(query);

            return db.get(query, [], callback);

        } else {

            return callback(false);

        }


    },

}