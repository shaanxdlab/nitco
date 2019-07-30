const { failure_callback, success_callback } = require('../common');
var Jimp = require('jimp');


module.exports = {


    checkParams: function(req, res, next) { //check the required params


        if (req.query.sourceSKUfolderPath == undefined || req.query.sourceSKUfolderPath == '' || req.query.sourceSKUfolderPath == null) {
            return failure_callback(res, ['sourceSKUfolderPath is missing', 401]);
        } else if (req.query.sourceImageName == undefined || req.query.sourceImageName == '' || req.query.sourceImageName == null) {
            return failure_callback(res, ['sourceImageName is missing', 401]);
        } else if (req.query.destImageName == undefined || req.query.destImageName == '' || req.query.destImageName == null) {
            return failure_callback(res, ['destImageName is missing', 401]);
        } else if (req.query.destWidth == undefined || req.query.destWidth == '' || req.query.destWidth == null) {
            return failure_callback(res, ['destWidth is missing', 401]);
        } else if (req.query.destHeight == undefined || req.query.destHeight == '' || req.query.destHeight == null) {
            return failure_callback(res, ['destHeight is missing', 401]);
        } else if (req.query.resizeMode == undefined || req.query.resizeMode == '' || req.query.resizeMode == null) {
            return failure_callback(res, ['resizeMode is missing', 401]);
        } else return next();
    },

    imageSize: function(req, res) { //create devision 

        var sourceSKUfolderPath = req.query.sourceSKUfolderPath.trim(),
            sourceImageName = req.query.sourceImageName.trim(),
            destImageName = req.query.destImageName.trim(),
            destWidth = parseInt(req.query.destWidth.trim()),
            destHeight = parseInt(req.query.destHeight.trim()),
            resizeMode = parseInt(req.query.resizeMode.trim());


        if (resizeMode == 0) {

            Jimp.read(`${sourceSKUfolderPath}/${sourceImageName}`)
                .then(img => {
                    return img
                        .resize(destWidth, destHeight) // resize
                        .write(`${destImageName}`); // save
                })
                .catch(err => {
                    console.error(err);
                });

            return success_callback(res, ['Image resize with mode 0 successfully done.']);

        } else if (resizeMode == 1) {

            Jimp.read(`${sourceSKUfolderPath}/${sourceImageName}`, function(err, image1) {

                image1.scaleToFit(destWidth, destHeight);

                var newHight = image1.bitmap.height;
                var newWidth = image1.bitmap.width;

                var newHalfHeigt = newHight / 2;
                var originalHalfHeight = destHeight / 2;
                var newY = originalHalfHeight - newHalfHeigt;

                var newHalfWidth = newWidth / 2;
                var originalHalfWidth = destWidth / 2;
                var newX = originalHalfWidth - newHalfWidth;


                new Jimp(destWidth, destHeight, 0xffffffff, function(err, image) {
                    image.opacity(0, function(err, image) {

                        image.composite(image1, newX, newY);

                        image.write(destImageName);
                    });
                });

                return success_callback(res, ['Image resize with mode 1 successfully done.']);

            })

        } else if (resizeMode == 2) {

            Jimp.read(`${sourceSKUfolderPath}/${sourceImageName}`)
                .then(img => {
                    return img
                        .cover(destWidth, destHeight)
                        .write(`${destImageName}`); // save

                })
                .catch(err => {
                    console.error(err);
                });


            return success_callback(res, ['Image resize with mode 2 successfully done.']);
        } else return failure_callback(res, ['resize mode is not correct', 401]);

    },



    autoImageSize: function(req, res) { //create devision 

        var sourceImage = req.query.sourceImage.trim(),
            dstName = req.query.destImageName.trim(),
            destWidth = parseInt(req.query.destWidth.trim()),
            destHeight = parseInt(req.query.destHeight.trim()),
            resizeMode = parseInt(req.query.resizeMode.trim());

        let destImageName = `./data/${dstName}`;

        console.log(destImageName);

        if (resizeMode == 0) {

            Jimp.read(sourceImage)
                .then(img => {
                    return img
                        .resize(destWidth, destHeight) // resize
                        .write(`${destImageName}`); // save
                })
                .catch(err => {
                    console.error(err);
                });

            return success_callback(res, ['Image resize with mode 0 successfully done.']);

        } else if (resizeMode == 1) {

            Jimp.read(sourceImage, function(err, image1) {

                image1.scaleToFit(destWidth, destHeight);

                var newHight = image1.bitmap.height;
                var newWidth = image1.bitmap.width;

                var newHalfHeigt = newHight / 2;
                var originalHalfHeight = destHeight / 2;
                var newY = originalHalfHeight - newHalfHeigt;

                var newHalfWidth = newWidth / 2;
                var originalHalfWidth = destWidth / 2;
                var newX = originalHalfWidth - newHalfWidth;


                new Jimp(destWidth, destHeight, 0xffffffff, function(err, image) {
                    image.opacity(0, function(err, image) {

                        image.composite(image1, newX, newY);

                        image.write(destImageName);
                    });
                });

                return success_callback(res, ['Image resize with mode 1 successfully done.']);

            })

        } else if (resizeMode == 2) {

            Jimp.read(sourceImage)
                .then(img => {
                    return img
                        .cover(destWidth, destHeight)
                        .write(`${destImageName}`); // save

                })
                .catch(err => {
                    console.error(err);
                });


            return success_callback(res, ['Image resize with mode 2 successfully done.']);
        } else return failure_callback(res, ['resize mode is not correct', 401]);

    }




}