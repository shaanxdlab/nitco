var sqlite3 = require('sqlite3').verbose();

module.exports = {

    connectDatabase: function(db) {

        //check the devision duplicacy

        if (!db) {

            db = new sqlite3.Database('./db/nitco2019data.db3', sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('database connected successfully.');
            });


        }
        return db;
    },

    connectUserDatabase: function(db2) {

        //check the devision duplicacy

        if (!db2) {

            db2 = new sqlite3.Database('./db/nitco2019user.db3', sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('User database connected successfully.');
            });


        }

        db2.run(`UPDATE tripmaster SET dateEnded = DATETIME('now','localtime') WHERE date(dateCreated) != date('now') AND dateEnded is null`);

        return db2;
    }

}