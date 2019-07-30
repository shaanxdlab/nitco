var dataDb = require('../database');
let db = dataDb.connectDatabase();

module.exports = {

    getTilesList: function(data, callback) {

        var keyword = data.keyword;
        var spaces = (data.space != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.space}' AND t.isActive=1  INTERSECT ` : '';
        var surface = (data.surface != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.surface}' AND t.isActive=1  INTERSECT ` : '';
        var color = (data.color != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.color}' AND t.isActive=1  INTERSECT ` : '';
        var price = (data.price != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value <= '${data.price}' AND t.isActive=1  INTERSECT ` : '';
        var space_size = (data.space_size != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.space_size}' AND t.isActive=1  INTERSECT ` : '';
        var material = (data.material != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.material}' AND t.isActive=1  INTERSECT ` : '';
        var product_size = (data.product_size != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value = '${data.product_size}' AND t.isActive=1  INTERSECT ` : '';
        var properties = (data.properties != 'all') ? `SELECT t.sku from tileMaster t LEFT JOIN tileDetailMaster d ON d.sku=t.sku WHERE d.value IN ('${data.properties.split(",").join("','")}') AND t.isActive=1  INTERSECT ` : '';

        let query = `SELECT t.sku, t.name, t.collection,
        
        (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Width') as width,
                
        (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Height') as height,
        
         (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as thickness,
         
         (select unit from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as unit,
        
        t.isWall, t.isFloor FROM tileMaster t `;

        if (keyword != '' && keyword != null) {
            query += `LEFT JOIN  tileDetailMaster d ON d.sku=t.sku WHERE (t.name LIKE '%${keyword}%' OR t.collection LIKE '%${keyword}%' OR d.value LIKE '%${keyword}%') AND `;
        } else {
            var qr = `${spaces}${surface}${color}${price}${space_size}${material}${product_size}${properties}`;
            query += `LEFT JOIN  tileDetailMaster d ON d.sku=t.sku WHERE t.sku IN (${qr.substring(0,qr.length - 11)}) AND `;
        }

        query += `t.isActive = 1`;


        console.log(query);

        return db.all(query, [], callback);


    },
    getTileDetail: function(sku, callback) {


        db.run(`UPDATE tileMaster SET numViews = numViews + 1 WHERE sku = ?`, [sku]);

        let query = `SELECT t.sku,t.name,t.collection,t.shape,t.isFloor,t.isWall,t.numViews,t.isAvailable, d.head,d.name as heading,d.value,d.unit,d.package `;
        query += `FROM tileMaster t INNER JOIN tileDetailMaster d ON d.sku=t.sku WHERE t.sku = '${sku}'`;

        console.log(query);

        return db.all(query, [], callback);


    },

    getTilesCollectionList: function(sku, callback) {

        let query = `SELECT t.sku, t.name, t.collection, 
        
        (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Width') as width,
                
        (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Height') as height,
        
         (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as thickness,
         
         (select unit from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as unit,
        
        t.isWall, t.isFloor FROM tileMaster t `;

        query += ` where t.collection = (SELECT collection from tileMaster WHERE sku = '${sku}') AND t.isActive=1 AND t.sku !='${sku}' ORDER BY t.numViews DESC LIMIT 6`;

        console.log(query);

        return db.all(query, [], callback);


    },


    getSimilarTilesList: function(sku, callback) {


        let query = `SELECT t.sku, t.name, t.collection, 
        
        (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Width') as width,
                
        (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Height') as height,
        
         (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as thickness,
         
         (select unit from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as unit,
        
        t.isWall, t.isFloor FROM tileMaster t `;

        query += `LEFT JOIN tileDetailMaster d ON d.sku = t.sku `;

        query += `where t.collection = (SELECT collection from tileMaster WHERE sku = '${sku}') `
        query += `AND d.name = (SELECT d.name FROM tileDetailMaster WHERE sku = '${sku}') `;
        query += `AND t.isActive=1 AND t.sku !='${sku}' ORDER BY t.numViews DESC LIMIT 10`;

        console.log(query);

        return db.all(query, [], callback);


    },


    getCombinationTilesList: function(sku, callback) {

        let query = `SELECT t.sku, t.name, t.collection, 
        
        (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Width') as width,
                
        (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Height') as height,
        
         (select value from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as thickness,
         
         (select unit from tileDetailMaster g where g.sku = t.sku AND head = 'details' AND name = 'Thickness') as unit,
        
        t.isWall, t.isFloor FROM tileMaster t `;

        query += `LEFT JOIN tileDetailMaster d ON d.sku = t.sku `;

        query += `where t.collection = (SELECT collection from tileMaster WHERE sku = '${sku}') `
        query += `AND d.name = (SELECT d.name FROM tileDetailMaster WHERE sku = '${sku}') `;
        query += `AND t.isActive=1 AND t.sku !='${sku}' ORDER BY t.numViews DESC LIMIT 10`;

        console.log(query);

        return db.all(query, [], callback);


    },

}