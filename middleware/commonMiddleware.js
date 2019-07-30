const {failure_callback} = require('../common.js');

 module.exports = {

    Authorization: function(req, res, next) {

    console.log(app.get('Authorization'));

    req.checkBody('Authorization', 'Bearer token is missing').notEmpty().trim();
    
    var errors = req.validationErrors();
  
    if (errors) return failure_callback(res,[errors[0].msg,401]); 
    
    else if(req.headers.Authorization!==app.get('Authorization')) return failure_callback(res,['Invalid Bearer token',401]); 
    
    else
    
    return next();

  },
    validateDevision: function(req, res, next) { 

      req.checkBody('title', 'title is required').notEmpty().trim();
    
      var errors = req.validationErrors();
    
      if (errors) return failure_callback(res,[errors[0].msg,400]); 
      
      return next();
     
    },
    validateDevisionId: function(req, res, next) { 

      req.checkParams('id', 'devision id is required').isInt();
    
      var errors = req.validationErrors();
    
      if (errors) return failure_callback(res,[errors[0].msg,400]);
    
      return next();
    },


  };

