var sqlite3 = require('sqlite3').verbose();
var db;

function connectDatabase() {
    if (!db) {

        db = new sqlite3.Database('./db/nitco2019testdata.db3', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
              console.error(err.message);
            }
            console.log('database connected successfully.');
      });

      
    }
    return db;
}

module.exports = connectDatabase();