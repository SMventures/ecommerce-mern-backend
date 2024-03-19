const express=require("express");
const router=express.Router();
const productController=require("../controllers/product.controller.js");

router.get('/', productController.getAllProducts);
router.get('/id/:id', productController.findProductById);
router.get('/search/:query', productController.searchProduct);
// router.get('/:category/similar',productController.getSimilarProducts)
router.get('/:category',productController.getSimilarProducts)

module.exports = router;