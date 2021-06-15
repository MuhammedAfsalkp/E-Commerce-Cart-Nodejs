const express = require("express");
const adminController=require('../controllers/admin')
const isAuth=require('../middleware/auth')
const validator=require('../middleware/validators')

//Routes starts with /admin
const router = express.Router();


router.get("/add-product",isAuth, adminController.getAddproduct);
router.post("/add-product",[isAuth,validator.validateAddProduct,adminController.postAddproduct]);
router.get("/products",isAuth,adminController.getProducts);
router.get("/edit-product/:productId",isAuth,adminController.getEditproduct)
router.post("/edit-product",[isAuth,validator.validateAddProduct,adminController.postEditproduct])
router.delete("/product/:productId",isAuth,adminController.deleteDeleteproduct)

module.exports = router;
