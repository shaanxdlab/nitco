var express = require('express');
var router = express.Router();
require('express-group-routes');

var vald = require('../middleware/commonMiddleware');
var ImageResizerContoller = require('../controllers/imageController');
var homeController = require('../controllers/homeController');
var tileController = require('../controllers/tileController');
var looksController = require('../controllers/looksController');
var productController = require('../controllers/productController');
var marbleController = require('../controllers/marbleController');


router.group("/api", function(router) {


    //router.all('*', vald.Authorization);

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


});

module.exports = router;