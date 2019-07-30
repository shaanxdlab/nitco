var dataDb = require('../database');
let db = dataDb.connectDatabase();
let db2 = dataDb.connectUserDatabase();

module.exports = {

    checkTripId: function(tripId, callback) {

        let query = `select count(*) as total FROM tripMaster WHERE id = '${tripId}' AND date(dateCreated) = date('now') AND dateEnded IS NULL`;


        console.log(query);

        return db2.get(query, [], callback);

    },


    CloseEntireTrip: function(data, callback) {

        db2.run(`UPDATE tripMaster SET dateEnded = DATETIME('now','localtime') WHERE id = ${data[0]}`);
        db2.run(`UPDATE sessionMaster SET logoutTime = DATETIME('now','localtime') WHERE tripId = '${data[0]}' AND installCode = '${data[1]}' AND date(loginTime) = date('now') AND logoutTime IS NULL`);

        return callback(null, 'success');

    },

    LogoutFromInstallation: function(data, callback) {

        db2.run(`UPDATE sessionMaster SET logoutTime = DATETIME('now','localtime') WHERE tripId = '${data[0]}' AND installCode = '${data[1]}' AND date(loginTime) = date('now') AND logoutTime IS NULL`);

        return callback(null, 'success');

    },

    getUserIdFromTripId: function(id, callback) {

        let query = `SELECT u.id as userId FROM userMaster u LEFT JOIN tripMaster t ON t.userId = u.id  WHERE t.id = ? AND date(t.dateCreated) = date('now') AND t.dateEnded IS NULL`;

        console.log(query);

        return db2.get(query, [id], callback);

    },


    getUserInfoAginstCode: function(code, callback) {

        let query = `SELECT u.id as userId, u.name,u.mobile,u.email, t.id as tripId, t.selCode as tripcode FROM userMaster u 
        LEFT JOIN tripMaster t ON t.userId = u.id  WHERE t.selCode = ? AND date(t.dateCreated) = date('now') AND t.dateEnded IS NULL`;

        console.log(query);

        return db2.get(query, [code], callback);

    },


}