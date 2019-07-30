var db = require('../database');

module.exports = {


    getMarbleDetail: function(sku, callback) {


        db.run(`UPDATE stoneMaster SET numViews = numViews + 1 WHERE sku = ?`, [sku]);

        let query = `select m.sku, m.name, m.family, m.category as collection, m.isWall, m.isFloor, m.isAvailable, d.head,d.name as heading,d.value,d.unit,d.package `;
        query += `FROM stoneMaster m INNER JOIN stoneDetailMaster d ON d.sku=m.sku WHERE m.sku = '${sku}'`;

        console.log(query);

        return db.all(query, [], callback);


    },


    getMarbleLotList: function(data, callback) {

        var sku = data.sku;
        let limit = (data.limit != '' && data.limit != 'all' && data.limit != undefined) ? ` LIMIT ${data.limit}` : ` LIMIT 30`;
        let offset = (data.offset != '' && data.offset != 'all' && data.offset != undefined) ? ` OFFSET ${data.offset}` : ` OFFSET 0`;


        let query = `select s.sku, s.lotSKU as lotNo, m.family, m.category as collection, ('INR ' || s.minPrice || '-' || s.maxPrice || '/sq ft') as price,`;
        query += `(select count(*) from slabMaster where lotSKU = s.lotSKU AND stoneSKU = '${sku}' AND isAvailable = 1) as slabs,`;
        query += `(select (sum(width*height) || ' Sq Ft') from slabMaster where lotSKU = s.lotSKU AND stoneSKU = '${sku}' AND isAvailable = 1) as area `;
        query += `from slabMaster s left join stoneMaster m ON m.sku = s.stoneSKU `;
        query += `where s.stoneSKU = '${sku}' AND s.isAvailable = 1 group by s.lotSKU ${limit} ${offset}`;

        console.log(query);

        return db.all(query, [], callback);


    },

    getMarbleSlabList: function(sku, callback) {

        let query = `select sku,lotSKU,width,height,thickness,minPrice,maxPrice,design,pattern,isAvailable from slabMaster where lotSKU = '${sku}' AND isActive = 1`;

        console.log(query);

        return db.all(query, [], callback);


    },


    getMarbleGalleryList: function(sku, callback) {

        let query = `
                SELECT t.sku, t.name, t.collection, d.value as length, k.value as width, d.unit, t.isWall, t.isFloor FROM tileMaster t `;
        query += `
                LEFT JOIN tileDetailMaster d ON d.sku = t.sku LEFT JOIN tileDetailMaster k ON k.sku = t.sku `;
        query += `
                where t.collection = (SELECT collection from tileMaster WHERE sku = '${sku}')
                `
        query += `
                AND d.name = (SELECT d.name FROM tileDetailMaster WHERE sku = '${sku}')
                `;
        query += `
                AND d.unit = (SELECT d.unit FROM tileDetailMaster WHERE sku = '${sku}')
                `;
        query += `
                AND t.isActive = 1 AND t.sku != '${sku}'
                AND d.head = 'details'
                AND d.name = 'Length'
                AND k.head = 'details'
                AND k.name = 'Width'
                ORDER BY t.numViews DESC LIMIT 10 `;

        console.log(query);

        return db.all(query, [], callback);


    },


    getSimilarMarblesList: function(data, callback) {

        var sku = data.sku;
        let limit = (data.limit != '' && data.limit != 'all' && data.limit != undefined) ? ` LIMIT ${data.limit}` : ` LIMIT 30`;
        let offset = (data.offset != '' && data.offset != 'all' && data.offset != undefined) ? ` OFFSET ${data.offset}` : ` OFFSET 0`;

        let query = `SELECT t.sku, t.name, t.family, t.category as collection, d.value as length, k.value as width, d.unit, t.isWall, t.isFloor FROM stoneMaster t `;
        query += `LEFT JOIN stoneDetailMaster d ON d.sku = t.sku LEFT JOIN stoneDetailMaster k ON k.sku = t.sku `;
        query += `where t.family = (SELECT family from stoneMaster WHERE sku = '${sku}') `;
        query += `AND t.category = (SELECT category from stoneMaster WHERE sku = '${sku}') `;
        query += `AND t.isActive=1 AND t.sku !='${sku}' AND d.head = 'details' AND d.name = 'Length' `;
        query += `AND k.head = 'details' AND k.name = 'Width' ORDER BY t.numViews DESC ${limit} ${offset}`;

        console.log(query);

        return db.all(query, [], callback);
    },


    getMarbleCombinationList: function(data, callback) {

        var sku = data.sku;
        let limit = (data.limit != '' && data.limit != 'all' && data.limit != undefined) ? ` LIMIT ${data.limit}` : ` LIMIT 30`;
        let offset = (data.offset != '' && data.offset != 'all' && data.offset != undefined) ? ` OFFSET ${data.offset}` : ` OFFSET 0`;

        let query = `select sku,
        (case when wallType1 = 'marble' then wallSKU1 else '' end ) as wallSKU1,
        (case when wallType2 = 'marble' then wallSKU2 else '' end ) as wallSKU2,
        (case when wallType3 = 'marble' then wallSKU3 else '' end ) as wallSKU3,
          
        (case when floorType1 = 'marble' then floorSKU1 else '' end ) as floorSKU1,
        (case when floorType2 = 'marble' then floorSKU2 else '' end ) as floorSKU2,
        (case when floorType3 = 'marble' then floorSKU3 else '' end ) as floorSKU3,  
      
      
      (select (c1+c2+c3+c4+c5+c6) as counter 
      
      from (select
      
      case when wallType1 = 'marble' then 1 else 0 end as c1,
      case when wallType2 = 'marble' then 1 else 0 end as c2,
      case when wallType3 = 'marble' then 1 else 0 end as c3,
      case when floorType1 = 'marble' then 1 else 0 end as c4,
      case when floorType2 = 'marble' then 1 else 0 end as c5,
      case when floorType3 = 'marble' then 1 else 0 end as c6
      
       from lookMaster
      
      where 
      
      (wallSKU1 = '${sku}' or wallSKU2 = '${sku}' or wallSKU3 = '${sku}' or floorSKU1 = '${sku}' or floorSKU2 = '${sku}' or floorSKU3 = '${sku}')
      
      )
      as tempr) as tmr from lookMaster 
      
      
      where 
      
      (wallSKU1 = '${sku}' or wallSKU2 = '${sku}' or wallSKU3 = '${sku}' or floorSKU1 = '${sku}' or floorSKU2 = '${sku}' or floorSKU3 = '${sku}') ${limit} ${offset}`;

        //  console.log(query);

        return db.all(query, [], callback);


    },



    getPartialMarbleDetail: function(sku, callback) {

        if (sku == undefined || sku == '') {

            return callback('', []);

        } else {
            query = `SELECT t.sku, t.name, t.family, t.category as collection, (d.value || ' x ' || k.value) as size FROM stoneMaster t  `;
            query += `LEFT JOIN  stoneDetailMaster d ON d.sku=t.sku LEFT JOIN stoneDetailMaster k ON k.sku=t.sku `;
            query += `WHERE t.sku = '${sku}' AND d.head = 'details' AND d.name = 'Length' AND k.head = 'details' AND k.name = 'Width' `;

            //console.log(query);

            return db.get(query, [], callback);

        }




    },

}