const express = require("express");
const shopController=require('../controllers/shop')
const isAuth=require('../middleware/auth')

const router = express.Router();

router.get("/",shopController.getIndex );
router.get("/cart",[isAuth,shopController.cartUpdate,shopController.getCart])
router.post("/cart",isAuth,shopController.postCart)

router.get("/products",shopController.getProducts)
router.get("/product/:productId",shopController.getProduct)
router.get("/orders",isAuth,shopController.getOrders)
router.post("/orders",isAuth,shopController.postOrders)
router.get("/checkout",isAuth,shopController.getCheckout)
router.post("/delete-fromcart",isAuth,shopController.postDEletefromcart)
router.get("/updatecart",isAuth,shopController.cartUpdate)





module.exports = router;
