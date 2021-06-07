const express = require("express");
const adminController=require('../controllers/admin')
const isAuth=require('../middleware/auth')

//Routes starts with /admin
const router = express.Router();


router.get("/add-product",isAuth, adminController.getAddproduct);
router.post("/add-product",isAuth,adminController.postAddproduct);
router.get("/products",isAuth,adminController.getProducts);
router.get("/edit-product/:productId",isAuth,adminController.getEditproduct)
router.post("/edit-product",isAuth,adminController.postEditproduct)
router.post("/delete-product",isAuth,adminController.postDeleteproduct)

module.exports = router;
