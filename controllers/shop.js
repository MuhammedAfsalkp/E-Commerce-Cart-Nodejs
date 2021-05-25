const Product = require("../models/product");
const Cart=require('../models/cart');
const { fetchbyid } = require("../models/product");
exports.getProducts = (req, res, next) => {
  console.log("MID PRODUCTLIST");
  Product.fetchall((product) => {
    console.log(product);
    res.render("shop/product-list", { product, pageTitle: "Products List", path: "/products" });
  });
};
exports.getIndex =(req,res,next)=>{
  console.log("MID index")
  Product.fetchall((product) => {
    console.log(product);
    res.render("shop/index", { product, pageTitle: "Home page", path: "/" });
  });
}
exports.getProduct=(req,res,next)=>{
  console.log("MID GETPRODUCT DETAILS")
  console.log(req.params.productId)
  Product.fetchbyid(req.params.productId,(product)=>{
    console.log(product)
    res.render('shop/product-details',{product,pageTitle:product.title,path:'/products'})

  })
  
}
exports.getCart=(req,res,next)=>{
  console.log("MID CART")
  Cart.getCartData((cartData)=>{
    console.log(cartData)
    let price=0;
    cartData.forEach((val)=>{
      price=price+(parseFloat(val.price)*parseInt(val.qty))
    })
    res.render('shop/cart',{pageTitle:'Cart',path:'/cart',price,product:cartData})
    

  })
  
        
}

  


exports.postCart=(req,res,next)=>{
  console.log("Mid post CART")
  console.log(req.body.productId,req.body.price)
  Cart.addToCart(req.body.productId,req.body.price,()=>{
    console.log("Written for cart")
    res.redirect('/cart')
  })
  

}
exports.getOrders=(req,res,next)=>{
  console.log("MID ORDERS")
  res.render('shop/orders',{pageTitle:'orders',path:'/orders'})
}
exports.getCheckout=(req,res,next)=>{
  console.log("MID CHECKOUT")
  res.render('shop/checkout',{pageTitle:'Checkout',path:'/checkout'})
}

exports.postDEletefromcart=(req,res,next)=>{
  console.log("MID Delete CART")
    const productId=req.body.productId;
    const entire=(req.body.entire == "true")
    Cart.deleteCartById(entire,productId,()=>{
      console.log("Deleted by id")
      res.redirect('/cart')
    })

}
