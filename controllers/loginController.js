var utils = require('../utils'),
    url = require('url'),
    fs = require('fs');
const loginModel = require('../models/login');
const { failure_callback, success_callback } = require('../common');
var message;


module.exports = {

    loginValidation: function(req, res, next) { //check the devision duplicacy

        var numberValidation = /^[0-9]+$/;
        var mobileValidate = /^[0]?[789]\d{9}$/;
        var emailValidate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (req.body.tripcode == undefined || req.body.tripcode == '') {

            if (req.body.login == undefined || req.body.login == '') {

                return failure_callback(res, ['mobile number or email is required', 400]);

            } else if (req.body.password == undefined || req.body.password == '') {

                return failure_callback(res, ['password is required', 400]);
            } else if (req.body.newcode == undefined || req.body.newcode == '') {

                return failure_callback(res, ['Please create four digit trip code', 400]);

            } else if (!numberValidation.test(req.body.newcode)) {

                return failure_callback(res, ['Only number is allowed in code', 400]);

            } else if (req.body.newcode.length != 4) {

                return failure_callback(res, ['Trip code must be four digits', 400]);

            } else if (req.body.installId == undefined || req.body.installId == null || req.body.installId == '') {

                return failure_callback(res, ['installId is required', 400]);

            } else if (!mobileValidate.test(req.body.login)) {

                if (!emailValidate.test(req.body.login)) {

                    return failure_callback(res, ['You must pass either mobile number or email Id', 400]);
                } else {

                    return next();
                }
            } else return next();
        } else return next();

    },

    signupValidation: function(req, res, next) { //check the devision duplicacy


        console.log(req.body);

        var mobileValidate = /^[0]?[789]\d{9}$/;
        var numberValidation = /^[0-9]+$/;
        var emailValidate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (req.body.name == undefined || req.body.name == '') {

            return failure_callback(res, ['Full name is required', 400]);
        } else if (req.body.mobile == undefined || req.body.mobile == '') {

            return failure_callback(res, ['mobile number is required', 400]);
        } else if (!mobileValidate.test(req.body.mobile)) {

            if (!numberValidation.test(req.body.mobile)) {

                return failure_callback(res, ['mobile number not in proper format', 400]);

            } else {

                return failure_callback(res, ['Please enter 10 digit mobile number', 400]);

            }
        } else if (req.body.installId == undefined || req.body.installId == null || req.body.installId == '') {

            return failure_callback(res, ['installId is required', 400]);

        }
        //else if (!emailValidate.test(req.body.email)) {

        //     return failure_callback(res, ['email id is not in proper format', 400]);
        // } else if (req.body.about == undefined || req.body.about == '') {

        //     return failure_callback(res, ['Select the button that most applies to you', 400]);
        // }
        // else if (req.body.about.trim().toLowerCase() !== 'owner' && req.body.about.trim().toLowerCase() !== 'professional') {

        //     return failure_callback(res, ['value must be Owner or Professional', 400]);
        // }
        else if (req.body.password == undefined || req.body.password == '') {

            return failure_callback(res, ['password is required', 400]);
        } else if (req.body.password.length < 6) {

            return failure_callback(res, ['password length is too short', 400]);
        } else if (req.body.newcode == undefined || req.body.newcode == '') {

            return failure_callback(res, ['Nitco code is required', 400]);
        } else if (req.body.newcode.length != 4) {

            return failure_callback(res, ['Trip code must be four digits', 400]);
        } else if (!numberValidation.test(req.body.newcode)) {

            return failure_callback(res, ['Only number is allowed in code', 400]);
        } else return next();

    },

    mobileVerification: function(req, res, next) { //the function of check mobile and number 

        var mobile = req.body.mobile;
        var installId = req.body.installId;

        loginModel.verifyMobile(mobile, function(err, row) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (row == undefined || row == null || row == '') {

                return failure_callback(res, ['Error while query sdssd', 500]);
            } else {

                if (row.userId > 0) {

                    loginModel.newTripCreate([row.userId, req.body.newcode, installId], function(err, row) {

                        if (err) return failure_callback(res, ['error in query', 500]);

                        else

                        if (row[0] == undefined || row[0] == null || row[0] == 0) {

                            return failure_callback(res, ['Error while query', 500]);
                        } else {

                            res.json({ status: 200, data: row[0], message: row[1] });

                        }



                    })

                } else return next();
            }

        })
    },


    emailVerification: function(req, res, next) { //the function of check email id 

        var email = req.body.email.trim();

        loginModel.verifyEmail(email, function(err, row) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (row == undefined || row == null) {

                return failure_callback(res, ['Error while query', 500]);
            } else {


                if (row.total > 0) {

                    return failure_callback(res, ['Email is allready registered', 400]);

                } else return next();
            }

        })
    },

    nitcoCodeVerification: function(req, res, next) { //the function of check email id 

        if (req.url == '/login') {

            if (req.body.tripcode == undefined || req.body.tripcode == null) {

                loginModel.checkNitcoCodeExists(req.body.newcode, function(err, row) {

                    if (err) return failure_callback(res, ['error in query', 500]);

                    else

                    if (row == undefined || row == null) {

                        return failure_callback(res, ['Error while query', 500]);
                    } else {

                        if (row.total > 0) {

                            loginModel.getUserInfo(['code', req.body.newcode], function(err, row) {

                                if (err) return failure_callback(res, ['error in getUserInfo query', 500]);

                                else

                                if (row == undefined || row == null) {

                                    if (err) return failure_callback(res, ['error in getUserInfo query', 500]);

                                } else {

                                    res.json({ status: 200, data: row, message: 'user details' });

                                }
                            })

                        } else return next();
                    }

                })

            } else {

                loginModel.checkNitcoCodeExists(req.body.tripcode, function(err, row) {

                    if (err) return failure_callback(res, ['error in query', 500]);

                    else

                    if (row == undefined || row == null) {

                        return failure_callback(res, ['Error while query', 500]);
                    } else {

                        if (row.total > 0) {

                            loginModel.getUserInfo(['code', req.body.tripcode], function(err, row) {

                                if (err) return failure_callback(res, ['error in getUserInfo query', 500]);

                                else

                                if (row == undefined || row == null) {

                                    if (err) return failure_callback(res, ['error in getUserInfo query', 500]);

                                } else {

                                    res.json({ status: 200, data: row, message: 'user details' });

                                }
                            })

                        } else return failure_callback(res, ['The tripcode is not valid', 400]);
                    }

                })

            }


        } else {

            loginModel.checkNitcoCodeExists(req.body.newcode, function(err, row) {

                if (err) return failure_callback(res, ['error in query', 500]);

                else

                if (row == undefined || row == null) {

                    return failure_callback(res, ['Error while query', 500]);
                } else {

                    if (row.total > 0) {

                        loginModel.getUserInfo(['mobile', req.body.mobile], function(err, row) {

                            //console.log(row);

                            if (err) return failure_callback(res, ['error in query', 500]);

                            else

                            if (row == undefined || row == null || row == '') {

                                return failure_callback(res, ['The trip is ongoing with this code please use another', 400]);

                            } else {

                                res.json({ status: 200, data: row, message: 'Mobile number is using this trip code' });

                            }


                        })




                    } else return next();
                }

            })

        }
    },

    login: function(req, res) { //get all rooms list

        var data = {};
        data.login = (req.body.login != '' && req.body.login != null && req.body.login != undefined) ? req.body.login.trim() : '',
            data.password = (req.body.password != '' && req.body.password != null && req.body.password != undefined) ? req.body.password.trim() : '',
            data.newcode = (req.body.newcode != undefined && req.body.newcode != null && req.body.newcode != '') ? req.body.newcode : '',
            data.tripcode = (req.body.tripcode != undefined && req.body.tripcode != null && req.body.tripcode != '') ? req.body.tripcode : '',
            data.installId = (req.body.installId != undefined && req.body.installId != null && req.body.installId != '') ? req.body.installId : '';


        if (data.tripcode != '') {

            loginModel.getUserInfoAginstCode([data.tripcode, data.installId], function(err, row) {

                if (err) return failure_callback(res, ['error in query', 500]);

                else

                if (row == undefined || row == null || row == 0) {

                    return failure_callback(res, ['No trip is onging with this code.', 400]);
                } else {

                    if (row[0] == 'error') {

                        return failure_callback(res, [row[1], 400]);

                    } else {

                        res.json({ status: 200, data: row[1], message: 'User Details' });

                    }

                }

            })

        } else {

            loginModel.login(data, function(err, result) {

                if (err) return failure_callback(res, ['error in query', 500]);

                else

                if (result == undefined || result == null) {

                    return failure_callback(res, ['error in query', 500]);

                } else {

                    if (result[0] == 'error') {

                        console.log(result);

                        return failure_callback(res, [result[1], 400]);
                    } else {

                        loginModel.checkNitcoCodeisFree([result[1].id, req.body.newcode], function(err, rest) {

                            if (err) return failure_callback(res, ['error in query', 500]);

                            else

                            if (rest.total > 0) {

                                return failure_callback(res, ['The trip is ongoing with this code please use another', 400]);

                            } else {


                                loginModel.newTripCreate([result[1].id, req.body.newcode, data.installId], function(err, row) {

                                    if (err) return failure_callback(res, ['error in query', 500]);

                                    else

                                    if (row[0] == undefined || row[0] == null || row[0] == 0) {

                                        return failure_callback(res, ['Error while query', 500]);
                                    } else {

                                        var dir = `data/trips/${row[0].tripId}`;

                                        if (!fs.existsSync(dir)) {
                                            fs.mkdirSync(dir, { recursive: true });
                                        }

                                        res.json({ status: 200, data: row[0], message: row[1] });

                                    }

                                })


                            }

                        })
                    }

                }

            })

        }



    },

    signup: function(req, res) { //get all rooms list

        var data = {};
        data.name = req.body.name.trim(),
            data.mobile = req.body.mobile,
            data.email = (req.body.email == undefined || req.body.email == null || req.body.email == '') ? '' : req.body.email,
            data.about = (req.body.about == undefined || req.body.about == null || req.body.about == '') ? 'other' : req.body.about,
            data.password = req.body.password.trim(),
            data.newcode = req.body.newcode;

        //console.log(data);

        loginModel.newRegistration(data, function(err, result) {


            console.log('iam in new registration');

            console.log(result);

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (result == undefined || result == null) {

                return failure_callback(res, ['error in query', 500]);

            } else {

                if (result == 'error') {

                    return failure_callback(res, ['error', 500]);

                } else {

                    loginModel.getUserInfo(['mobile', data.mobile], function(err, row) {

                        if (err) return failure_callback(res, ['error in getUserInfo query', 500]);

                        else

                        if (row == undefined || row == null) {

                            if (err) return failure_callback(res, ['error in getUserInfo query', 500]);

                        } else {

                            var dir = `data/trips/${row.tripId}`;

                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir, { recursive: true });
                            }

                            res.json({ status: 200, data: row, message: 'New Registration successfully done' });

                        }
                    })

                }

            }

        })
    },


}