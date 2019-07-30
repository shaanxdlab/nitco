var fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    router = require('./routes/route'),
    cors = require('cors'),
    app = express();
    require("dotenv").config();

    app.set('port', process.env.PORT || 5000);
    app.set('env', process.env.ENVIRONMENT);
    //app.set('Authorization', process.env.TOKEN_SECRET); 


app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//app.use(expressValidator());
//app.use(expressLogging(logger));  
app.use('/api', router);

app.use('/data', express.static('data'));

app.listen(process.env.PORT || 5000, () => {
    console.log('app listening on port ' + process.env.PORT || 5000)
});


// error handlers
app.use(function(req, res, next) {
    res.status(404).json({ error: 1, message: 'No route found!' });
});

app.use(function(req, res, next) {
    res.status(500).json({ error: 1, message: 'Internal server error!' });
});

module.exports = { app, fs };