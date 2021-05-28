const productModel = require("../models/product");
const cartModel=require('../models/cart');
exports.getProducts = (req, res, next) => {
  console.log("MID PRODUCTLIST");
 productModel.Product.fetchall().then(product=>{
   console.log("Got products")
  res.render("shop/product-list", { product, pageTitle: "Products List", path: "/products" });
 })
}
exports.getIndex =(req,res,next)=>{
  console.log("MID index")
  productModel.Product.fetchall().then(product=>{
    console.log(product)
    res.render("shop/index", { product, pageTitle: "Home page", path: "/" });
  })
  }
exports.getProduct=(req,res,next)=>{
  console.log("MID GETPRODUCT DETAILS")
  console.log(req.params.productId)
 productModel.Product.fetchbyid(req.params.productId).then(product=>{
  console.log(product)
  res.render('shop/product-details',{product,pageTitle:product.title,path:'/products'})
 }).catch(err=>console.log(err,"fetching"))
}
  

exports.getCart=(req,res,next)=>{
  console.log("MID CART")
  req.user.getCartData().then(product=>{
    console.log("data got")
    console.log(product)
    res.render('shop/cart',{pageTitle:'Cart',path:'/cart',price:100,product})
  }).catch(err=>console.log(err,"Getting cart data"))
 
    
       
}


exports.postCart=(req,res,next)=>{
  console.log("Mid post CART")
  console.log(req.body.productId)
  const productId=req.body.productId
  console.log(req.user,"postcart")
  req.user.addtoCart(productId).then(ris=>{
    console.log("Aded to cart successsfully")
    res.redirect('/cart')
    
  })
  
}
exports.postOrders=(req,res,next)=>{
  console.log("MID  POST ORDERS")
  req.user.addorder().then(ris=>{
    console.log("Orderes")
    res.redirect("/orders")
  }).catch(err=>console.log(err,"adding order"))  

}



exports.getOrders=(req,res,next)=>{
  console.log("MID GET ORDERS")
  req.user.getorder().then(order=>{
    console.log("data fetched")
    res.render('shop/orders',{pageTitle:'orders',path:'/orders',order})

  }).catch(err=>console.log(err,"getting order data"))  
 
}
exports.getCheckout=(req,res,next)=>{
  console.log("MID CHECKOUT")
  res.render('shop/checkout',{pageTitle:'Checkout',path:'/checkout'})
}

exports.postDEletefromcart=(req,res,next)=>{
  console.log("MID Delete CART")
    const productId=req.body.productId;
    const entire=(req.body.entire == "true")
    req.user.delFromCart(productId,entire).then(ris=>{
      console.log("Deleted cart ")
      res.redirect('/cart')
    }).catch(err=>console.log(err,"Deleting Cart"))
}
