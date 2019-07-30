var dataDb = require('../database');
let db = dataDb.connectDatabase();
let db2 = dataDb.connectUserDatabase();

module.exports = {

    verifyMobile: function(mobile, callback) {

        let query = `select count(*) as total,id as userId,name,mobile,email,aboutMe,numVisits FROM userMaster WHERE mobile = '${mobile}'`;

        console.log(query);

        return db2.get(query, [], callback);

    },
    verifyEmail: function(email, callback) {

        let query = `select count(*) as total FROM userMaster WHERE email = '${email}'`;

        return db2.get(query, [], callback);

    },


    checkNitcoCodeisFree: function(data, callback) {

        let query = `select count(*) as total FROM tripMaster WHERE selCode = '${data[1]}' AND userId!='${data[0]}' AND date(dateCreated) = date('now') AND dateEnded IS NULL`;


        console.log(query);

        return db2.get(query, [], callback);

    },


    checkNitcoCodeExists: function(code, callback) {

        let query = `select count(*) as total FROM tripMaster WHERE selCode = '${code}' AND date(dateCreated) = date('now') AND dateEnded IS NULL`;

        return db2.get(query, [], callback);

    },


    newTripCreate: function(data, callback) {

        let query = `select u.id as userId,u.name,u.mobile,u.email,t.id as tripId, t.selCode as tripcode FROM userMaster u 
        LEFT JOIN tripMaster t ON t.userId = u.id WHERE t.userId = ${data[0]} AND date(t.dateCreated) = date('now') AND t.dateEnded IS NULL`;

        db2.get(query, [], function(err, row) {

            if (err) {

                return callback(null, 0);

            } else {

                if (row == undefined || row == null || row == '') {


                    db2.run(`INSERT INTO tripMaster (userId,selCode) VALUES(?,?)`, [data[0], data[1]], function(err) {

                        if (err) {

                            return callback(null, 0);

                        } else {

                            db2.run(`INSERT INTO sessionMaster (tripId,installCode) VALUES ('${this.lastID}', '${data[2]}')`);

                            let query = `select u.id as userId,u.name,u.mobile,u.email,t.id as tripId, t.selCode as tripcode FROM userMaster u 
                            LEFT JOIN tripMaster t ON t.userId = u.id WHERE t.userId = ? AND date(t.dateCreated) = date('now') AND t.dateEnded IS NULL`;


                            db2.get(query, [data[0]], function(err, row) {

                                return callback(null, [row, 'New Trip is created with this mobile number']);

                            })
                        }

                    })

                } else {

                    db2.get(`SELECT count(*) as total FROM sessionMaster WHERE tripId = '${row.tripId}' AND installCode = '${data[2]}'`, [], function(err, row2) {


                        if (row2.total == 0) {

                            db2.run(`INSERT INTO sessionMaster (tripId,installCode) VALUES ('${row.tripId}', '${data[2]}')`);

                        }

                        return callback(null, [row, 'Mobile number is using this trip code']);

                    })


                }

            }

        })

    },


    newRegistration: function(data, callback) {

        let query = `INSERT INTO userMaster (name,mobile,email,aboutMe,password) VALUES ('${data.name}','${data.mobile}','${data.email}','${data.about}','${data.password}')`;

        console.log(query);

        db2.run(query, [], function(err, row) {
            if (err) {

                return callback(null, 'error');

            }

            var UserID = this.lastID;

            db2.run(`INSERT INTO tripMaster (userId,selCode) VALUES(?,?)`, [UserID, data.newcode], function(err) {


                if (err) {

                    return callback(null, 'error');

                } else

                    return callback(null, UserID);

            });


        });

    },


    login: function(data, callback) {

        let colm = '';
        var emailValidate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailValidate.test(data.login)) {

            colm = 'mobile';
        } else {

            colm = 'email';
        }

        db2.get(`SELECT u.id FROM userMaster u WHERE  ${colm} = '${data.login}' AND password = '${data.password}'`, [], function(err, row) {
            if (err) {

                return callback(null, ['error', 'error in query']);

            } else

            if (row == undefined || row == null || row == '') {

                return callback(null, ['error', `${colm} or password is incorrect`]);

            } else {

                if (row.id > 0) {

                    return callback(null, ['success', row]);

                } else {

                    return callback(null, ['error', `${colm} or password is incorrect`]);

                }
            }

        });

    },

    getUserInfo: function(data, callback) {

        let column = (data[0] == 'mobile') ? 'u.mobile' : 't.selCode';

        let query = `SELECT u.id as userId, u.name,u.mobile,u.email,t.id as tripId, t.selCode as tripcode FROM userMaster u 
        LEFT JOIN tripMaster t ON t.userId = u.id  WHERE ${column} = '${data[1]}' AND date(t.dateCreated) = date('now') AND t.dateEnded IS NULL`;

        return db2.get(query, [], callback);

    },


    getUserInfoAginstCode: function(data, callback) {

        let query = `SELECT count(*) as total, u.id as userId, u.name,u.mobile,u.email, t.id as tripId, t.selCode as tripcode FROM userMaster u 
        LEFT JOIN tripMaster t ON t.userId = u.id  WHERE t.selCode = ? AND date(t.dateCreated) = date('now') AND t.dateEnded IS NULL`;

        console.log(query);

        db2.get(query, [data[0]], function(err, row) {

            if (err) return callback(null, ['error', 'error in query']);

            else

            if (row.total > 0) {

                db2.get(`SELECT count(*) as total FROM sessionMaster WHERE tripId = '${row.tripId}' AND installCode = '${data[1]}' AND date(loginTime) = date('now') AND logoutTime IS NULL`, [], function(err, row2) {

                    if (err) return callback(null, ['error', 'error in query']);

                    else

                    if (row2.total == 0) {

                        db2.run(`INSERT INTO sessionMaster (tripId,installCode) VALUES ('${row.tripId}', '${data[1]}')`);
                    }
                    return callback(null, ['success', row]);

                })
            } else {


                return callback(null, ['error', 'Trip code is not valid']);

            }



        })

    },


}