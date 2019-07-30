require("dotenv").config();
require('express-group-routes');
var fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    router = require('./routes/route'),
    expressLogging = require('express-logging'),
    //logger = require('logops'),
    app = express();
   
//app.set('port', process.env.PORT || 5000);
app.set('env', process.env.ENVIRONMENT);
//app.set('Authorization', process.env.TOKEN_SECRET); 

//app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressValidator());
//app.use(expressLogging(logger));  
app.use('/', router);

app.listen(process.env.PORT || 5000, () => {
    console.log('app listening on port '+process.env.PORT || 5000)
  });
 
// error handlers
app.use(function (req, res, next) {
  res.status(404).json({error:1,message:'No route found!'});
});

  app.use(function (req, res, next) {
    res.status(500).json({error:1,message:'Internal server error!'});
  });

  module.exports = {app,fs};

  