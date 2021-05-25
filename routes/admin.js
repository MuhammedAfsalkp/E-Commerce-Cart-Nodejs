const express = require("express");
const adminController=require('../controllers/admin')

//Routes starts with /admin
const router = express.Router();


router.get("/add-product", adminController.getAddproduct);
router.post("/add-product",adminController.postAddproduct);
router.get("/products",adminController.getProducts);
router.get("/edit-product/:productId",adminController.getEditproduct)
router.post("/edit-product",adminController.postEditproduct)
router.post("/delete-product",adminController.postDeleteproduct)

module.exports = router;
