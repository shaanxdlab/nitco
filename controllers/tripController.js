const tripModel = require('../models/trips');
const { failure_callback, success_callback } = require('../common');
var message;
const filterCache = {};


module.exports = {

    InstallationLogout: function(req, res) { //close the entire trip with last installation id and trip id

        if (req.body.tripId == undefined || req.body.tripId == null || req.body.tripId == '') {

            return failure_callback(res, ['tripId is required', 400]);
        } else if (req.body.installId == undefined || req.body.installId == null || req.body.installId == '') {

            return failure_callback(res, ['installId is required', 400]);

        } else

            tripModel.checkTripId(req.body.tripId, function(err, row) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (row == undefined || row == null || row == '') {

                return failure_callback(res, ['TripId is not valid', 400]);
            } else {

                if (row.total > 0) {

                    tripModel.LogoutFromInstallation([req.body.tripId, req.body.installId], function(err, row) {

                        if (err) return failure_callback(res, ['error in query', 500]);

                        else
                            res.json({ status: 200, message: `You Logout from installation ${req.body.installId}.` });
                    })

                } else {

                    return failure_callback(res, ['Trip Id is not valid', 400]);

                }

            }

        })

    },


    CloseEntireTrip: function(req, res) { //close the entire trip with last installation id and trip id

        if (req.body.tripId == undefined || req.body.tripId == null || req.body.tripId == '') {

            return failure_callback(res, ['tripId is required', 400]);
        } else if (req.body.installId == undefined || req.body.installId == null || req.body.installId == '') {

            return failure_callback(res, ['installId is required', 400]);

        } else

            tripModel.checkTripId(req.body.tripId, function(err, row) {

            if (err) return failure_callback(res, ['error in query', 500]);

            else

            if (row == undefined || row == null || row == '') {

                return failure_callback(res, ['TripId is not valid', 500]);
            } else {

                if (row.total > 0) {

                    tripModel.CloseEntireTrip([req.body.tripId, req.body.installId], function(err, row) {

                        if (err) return failure_callback(res, ['error in query', 500]);

                        else

                            res.json({ status: 200, message: 'Your trip is closed.' });

                    })

                } else {

                    return failure_callback(res, ['Trip Id is not valid', 400]);

                }

            }

        })

    },



}