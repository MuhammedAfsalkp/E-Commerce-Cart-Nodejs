const express = require("express");
const shopController=require('../controllers/shop')

const router = express.Router();

router.get("/",shopController.getIndex );
router.get("/cart",[shopController.cartUpdate,shopController.getCart])
router.post("/cart",shopController.postCart)

router.get("/products",shopController.getProducts)
router.get("/product/:productId",shopController.getProduct)
router.get("/orders",shopController.getOrders)
router.post("/orders",shopController.postOrders)
router.get("/checkout",shopController.getCheckout)
router.post("/delete-fromcart",shopController.postDEletefromcart)
router.get("/updatecart",shopController.cartUpdate)




module.exports = router;
