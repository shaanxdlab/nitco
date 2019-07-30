var express = require('express');
var router = express.Router();

var vald = require('../middleware/commonMiddleware');
var ImageResizerContoller = require('../controllers/imageController');
var homeController = require('../controllers/homeController');
var tileController = require('../controllers/tileController');
var looksController = require('../controllers/looksController');
var productController = require('../controllers/productController');
var marbleController = require('../controllers/marbleController');
var loginController = require('../controllers/loginController');
var tripController = require('../controllers/tripController');
var shortListController = require('../controllers/shortListController');


router.use(function timeLog(req, res, next) {
    console.log(`\n\nAPI ROUTE : ${req.protocol}://${req.get('host')}${req.originalUrl} \n\n`)
    next()
});

//router.group("/api", function(router) {


//router.all('*', vald.Authorization);

router.get('/auto_image_resizer', ImageResizerContoller.autoImageSize);

router.get('/image_resizer', ImageResizerContoller.checkParams, ImageResizerContoller.imageSize);

router.get('/roomsets', homeController.roomValidation, homeController.roomList);

router.get('/filter', homeController.filterList); // filter products wise or looks wise list type = looks OR products

router.get('/looks', looksController.looksList);
router.get('/look_detail', looksController.lookDetail);
router.get('/similar_looks', looksController.similarLooksList);


router.get('/styles', looksController.stylesList);
router.get('/style_detail', looksController.styleDetail);
router.get('/similar_styles', looksController.similarStylesList);


router.get('/products', productController.productsList);
router.get('/product_detail', homeController.skuDetail); // genric function to sku detail from look,tiles,marble,mossac table
router.get('/product_in_this_collection', productController.productsInThisCollection);
router.get('/similar_products', productController.similarProductsList);
router.get('/combination_products', productController.combinationProductsList);


router.get('/martble_lots', marbleController.marbleLotList);
router.get('/marble_slab', marbleController.marbleSlabList);
router.get('/marble_gallery', marbleController.marbleGalleryList);
router.get('/similar_marbles', marbleController.similarMarblesList);
router.get('/marble_combination', marbleController.marbleCombinationList);


router.post('/login', loginController.loginValidation, loginController.login);
router.post('/signup', loginController.signupValidation, loginController.nitcoCodeVerification, loginController.mobileVerification, loginController.signup);

router.post('/install_logout', tripController.InstallationLogout);
router.post('/close_trip', tripController.CloseEntireTrip);

router.post('/collect_look', shortListController.addShortListValidation, shortListController.collectLook);
router.get('/shortList', shortListController.getShortListByTripId);
router.get('/collection_detail', shortListController.getCollectionDetailByTripId);
router.get('/delete_collection', shortListController.deleteCollectionFromShortList);

router.post('/collection_trial', shortListController.addOrRemoveCollectionFromTrail);





//});

module.exports = router;