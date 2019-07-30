var dataDb = require('../database');
let db = dataDb.connectDatabase();

module.exports = {

    getProductsList: function(data, callback) {

        let limit = (data.limit != '' && data.limit != 'all' && data.limit != undefined) ? ` LIMIT ${data.limit}` : ` LIMIT 30`;
        let offset = (data.offset != '' && data.offset != 'all' && data.offset != undefined) ? ` OFFSET ${data.offset}` : ` OFFSET 0`;


        var tileKeyword = data.keyword;
        var spaces = (data.space != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.space}' AND t.isActive=1  INTERSECT ` : '';
        var surface = (data.surface != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.surface}' AND t.isActive=1  INTERSECT ` : '';
        var color = (data.color != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.color}' AND t.isActive=1  INTERSECT ` : '';
        var price = (data.price != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value <= '${data.price}' AND t.isActive=1  INTERSECT ` : '';
        var material = (data.material != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.material}' AND t.isActive=1  INTERSECT ` : '';
        var product_size = (data.product_size != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.product_size}' AND t.isActive=1  INTERSECT ` : '';
        var properties = (data.properties != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value IN ('${data.properties.split(",").join("','")}') AND t.isActive=1  INTERSECT ` : '';

        let query = `SELECT * FROM 

        (SELECT  *    
        FROM  (

        SELECT t.sku, t.name, t.collection,  
        
        (select value from tileDetailMaster where sku = t.sku AND head = 'details' AND name = 'Width') as width,
                
        (select value from tileDetailMaster where sku = t.sku AND head = 'details' AND name = 'Height') as height,
        
         (select value from tileDetailMaster where sku = t.sku AND head = 'details' AND name = 'Thickness') as thickness,
         
         (select unit from tileDetailMaster where sku = t.sku AND head = 'details' AND name = 'Thickness') as unit,
        
        t.isWall, t.isFloor FROM tileMaster t `;

        if (tileKeyword != '' && tileKeyword != null) {
            query += ` WHERE (t.name LIKE '%${tileKeyword}%' OR t.collection LIKE '%${tileKeyword}%' OR d.value LIKE '%${tileKeyword}%') AND `;
        } else {
            var qr = `${spaces}${surface}${color}${price}${material}${product_size}${properties}`;

            query += ` WHERE `;

            if (qr != '' && qr != null) {

                query += ` t.sku IN (${qr.substring(0,qr.length - 11)}) AND `;
            }
        }

        query += `t.isActive = 1`;
        query += `${limit} ${offset} )`;

        query += ` UNION ALL `;


        var stoneKeyword = data.keyword;
        var spaces = (data.space != 'all') ? `SELECT t.sku from stoneMaster t LEFT JOIN stoneDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.space}' AND t.isActive=1  INTERSECT ` : '';
        var surface = (data.surface != 'all') ? `SELECT t.sku from stoneMaster t LEFT JOIN stoneDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.surface}' AND t.isActive=1  INTERSECT ` : '';
        var color = (data.color != 'all') ? `SELECT t.sku from stoneMaster t LEFT JOIN stoneDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.color}' AND t.isActive=1  INTERSECT ` : '';
        var price = (data.price != 'all') ? `SELECT t.sku from stoneMaster t LEFT JOIN stoneDetailMaster d ON d.sku=t.sku WHERE d.value <= '${data.price}' AND t.isActive=1  INTERSECT ` : '';
        var material = (data.material != 'all') ? `SELECT t.sku from stoneMaster t LEFT JOIN stoneDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.material}' AND t.isActive=1  INTERSECT ` : '';
        var product_size = (data.product_size != 'all') ? `SELECT t.sku from stoneMaster t LEFT JOIN stoneDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.product_size}' AND t.isActive=1  INTERSECT ` : '';
        var properties = (data.properties != 'all') ? `SELECT t.sku from stoneMaster t LEFT JOIN stoneDetailMaster d ON d.sku=t.sku WHERE d.value IN ('${data.properties.split(",").join("','")}') AND t.isActive=1  INTERSECT ` : '';

        query += `SELECT  *
        FROM    (
            
        SELECT t.sku, t.name, t.category as collection,
        
        (select value from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Width') as width,
                
        (select value from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Height') as height,
        
         (select value from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as thickness,
         
         (select unit from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as unit,
        
        t.isWall, t.isFloor FROM stoneMaster t `;

        if (stoneKeyword != '' && stoneKeyword != null) {
            query += ` WHERE (t.name LIKE '%${stoneKeyword}%' OR t.collection LIKE '%${stoneKeyword}%' OR d.value LIKE '%${stoneKeyword}%') AND `;
        } else {
            var qr = `${spaces}${surface}${color}${price}${material}${product_size}${properties}`;

            query += ` WHERE `;

            if (qr != '' && qr != null) {

                query += ` t.sku IN (${qr.substring(0,qr.length - 11)}) AND `;
            }
        }

        query += `t.isActive = 1 `;

        query += `${limit} ${offset} )) ORDER BY random() ${limit} ${offset}`;


        console.log(query);

        return db.all(query, [], callback);


    },



    getProductCollectionList: function(sku, callback) {


        db.get(`SELECT count(*) as total FROM tileMaster WHERE sku = ?`, [sku], (err, Trow) => {
            if (err) {
                return console.error(err.message);
            }

            if (Trow.total > 0) {

                let query = `SELECT t.sku, t.name, t.collection, 

                (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Width') as width,
                
                (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Height') as height,
                
                 (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as thickness,
                 
                 (select unit from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as unit,
                
                t.isWall, t.isFloor FROM tileMaster t `;
                query += `where t.collection = (SELECT collection from tileMaster WHERE sku = '${sku}') `
                query += `AND t.isActive=1 AND t.sku !='${sku}' ORDER BY t.numViews DESC LIMIT 6`;

                console.log(query);

                return db.all(query, [], callback);

            } else {


                db.get(`SELECT count(*) as total FROM stoneMaster WHERE sku = ?`, [sku], (err, Srow) => {
                    if (err) {
                        return console.error(err.message);
                    }

                    if (Srow.total > 0) {

                        let query = `SELECT t.sku, t.name, t.category as collection, 
                        
                        (select value from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Width') as width,
                
                        (select value from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Height') as height,
                        
                        (select value from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as thickness,
                         
                        (select unit from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as unit,
                        
                        t.isWall, t.isFloor FROM stoneMaster t `;
                        query += ` where t.family = (SELECT family from stoneMaster WHERE sku = '${sku}') `
                        query += `AND t.isActive=1 AND t.sku !='${sku}' ORDER BY t.numViews DESC LIMIT 6`;

                        console.log(query);

                        return db.all(query, [], callback);

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

    },



    getSimilarProductsList: function(sku, callback) {


        db.get(`SELECT count(*) as total FROM tileMaster WHERE sku = ?`, [sku], (err, Trow) => {
            if (err) {
                return console.error(err.message);
            }

            if (Trow.total > 0) {

                let query = `SELECT t.sku, t.name, t.collection, 
                
                (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Width') as width,
                
                (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Height') as height,
                
                (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as thickness,
                 
                (select unit from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as unit,
                
                t.isWall, t.isFloor FROM tileMaster t `;

                query += `where t.collection = (SELECT collection from tileMaster WHERE sku = '${sku}') `

                query += `AND t.isActive=1 AND t.sku !='${sku}' ORDER BY t.numViews DESC LIMIT 10`;

                console.log(query);

                return db.all(query, [], callback);

            } else {


                db.get(`SELECT count(*) as total FROM stoneMaster WHERE sku = ?`, [sku], (err, Srow) => {
                    if (err) {
                        return console.error(err.message);
                    }

                    if (Srow.total > 0) {

                        let query = `SELECT t.sku, t.name, t.category as collection, 
                        
                        (select value from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Width') as width,
                
                        (select value from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Height') as height,
                        
                        (select value from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as thickness,
                         
                        (select unit from stoneDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as unit,
                        
                        t.isWall, t.isFloor FROM stoneMaster t `;

                        query += `where t.family = (SELECT family from stoneMaster WHERE sku = '${sku}') `

                        query += `AND t.isActive=1 AND t.sku !='${sku}' ORDER BY t.numViews DESC LIMIT 10`;


                        console.log(query);

                        return db.all(query, [], callback);

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

    },


    getCombinationProductsList: function(sku, callback) {

        let SKUs = '';

        if (sku.length == 1) {

            SKUs = sku;

        } else {

            SKUs = sku.join("','");
        }

        let query = `SELECT t.sku, t.name, t.family as collection, d.value as height, k.value as width, d.unit, t.isWall, t.isFloor FROM stoneMaster t `;
        query += `LEFT JOIN stoneDetailMaster d ON d.sku = t.sku LEFT JOIN stoneDetailMaster k ON k.sku = t.sku `;
        query += `WHERE t.isActive=1 AND t.sku IN ('${SKUs}') AND d.head = 'details' AND d.name = 'Height' AND k.head = 'details' AND k.name = 'Width'`;

        query += ` UNION `;
        query += `SELECT t.sku, t.name, t.collection, d.value as height, k.value as width, d.unit, t.isWall, t.isFloor FROM tileMaster t `;
        query += `LEFT JOIN tileDetailMaster d ON d.sku = t.sku LEFT JOIN tileDetailMaster k ON k.sku = t.sku `;
        query += `WHERE t.isActive=1 AND t.sku IN ('${SKUs}') AND d.head = 'details' AND d.name = 'Height' AND k.head = 'details' AND k.name = 'Width'`;

        console.log(query);

        return db.all(query, [], callback);

    },

    getCombinationSKU: function(sku, callback) {

        let query = `select wallSKU1, wallSKU2, wallSKU3, floorSKU1, floorSKU2, floorSKU3 from lookMaster where `;
        query += `sku IN(select sku from  lookMAster where wallSKU1 = '${sku}'  or wallSKU2 = '${sku}' or wallSKU3 = '${sku}' or floorSKU1 = '${sku}' or `;
        query += `floorSKU2 = '${sku}' or floorSKU3 = '${sku}' AND  isActive = 1 limit 6);`


        console.log(query);

        return db.all(query, [], callback);

    },

    getRandomProductsList: function(sku, callback) {

        let query = `SELECT * FROM (SELECT t.sku, t.name, t.family as collection, d.value as height, k.value as width, d.unit, t.isWall, t.isFloor FROM stoneMaster t `;
        query += `LEFT JOIN stoneDetailMaster d ON d.sku = t.sku LEFT JOIN stoneDetailMaster k ON k.sku = t.sku `;
        query += `WHERE t.isActive=1 AND t.sku!= '${sku}' AND d.head = 'details' AND d.name = 'Height' AND k.head = 'details' AND k.name = 'Width' ORDER BY RANDOM() LIMIT 0,5)`;

        query += ` UNION `;

        query += `SELECT * FROM (SELECT t.sku, t.name, t.collection, d.value as height, k.value as width, d.unit, t.isWall, t.isFloor FROM tileMaster t `;
        query += `LEFT JOIN tileDetailMaster d ON d.sku = t.sku LEFT JOIN tileDetailMaster k ON k.sku = t.sku `;
        query += `WHERE t.isActive=1 AND t.sku!= '${sku}' AND d.head = 'details' AND d.name = 'Height' AND k.head = 'details' AND k.name = 'Width' ORDER BY RANDOM() LIMIT 0,5)`;

        console.log(query);

        return db.all(query, [], callback);

    }

}