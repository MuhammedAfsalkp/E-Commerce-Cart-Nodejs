const Product = require("../models/product");
const Order = require("../models/order");
const fs=require('fs')
const path=require('path')
exports.getProducts = (req, res, next) => {
  
  console.log("MID PRODUCTLIST");
  Product.find().then((product) => {
    console.log("Got products");
    res.render("shop/product-list", {
      product,
      pageTitle: "Products List",
      path: "/products",
      isAuthenticated:req.session.isLoggedIn
    });
  });
};
exports.getIndex = (req, res, next) => {
  

  console.log("MID index",req.session.isLoggedIn);
  Product.find().then((product) => {
    //console.log(product);
    res.render("shop/index", { product, pageTitle: "Home page", path: "/" ,isAuthenticated:req.session.isLoggedIn});
  }).catch(err=>{return next(new Error(err));})
};
exports.getProduct = (req, res, next) => {
 
  console.log("MID GETPRODUCT DETAILS");
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-details", {
        product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated:req.session.isLoggedIn
        
      });
    })
    .catch((err) => {console.log(err, "fetching")
    return next(new Error(err));}
    
    );
};

exports.getCart = (req, res, next) => {
  
 
  console.log("MID CART");
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((data) => {
     
      console.log(data);
      console.log(data.cart.items);
      let price=0;
      data.cart.items.forEach(val=>{
        price=price+(val.productId.price*val.quantity)
      })
      const product = data.cart.items;
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        price,
        product,
        isAuthenticated:req.session.isLoggedIn
      });
    })
    .catch((err) =>{ console.log(err, "Getting cart data")
    // return next(new Error(err));
    return next(err)
  
  });
};

exports.postCart = (req, res, next) => {
  console.log("Mid post CART");
  console.log(req.body.productId);
  const productId = req.body.productId;
  console.log(req.user, "postcart");
  req.user.addToCart(productId).then((ris) => {
    console.log("Aded to cart successsfully");
    res.redirect("/cart");
  }).catch(err=>{
    return next(new Error(err));
  })
};
//error not handled
exports.postOrders = (req, res, next) => {
  console.log("MID  POST ORDERS");
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      let productdata = user.cart.items.map((val) => {
        return { product: { ...val.productId._doc }, quantity: val.quantity };
      });
      console.log(productdata);
      const order = new Order({
        user: {
          userId: req.user._id,
          email: req.user.email,
        },
        items: productdata,
      });
      console.log("order", order.items);
      return order.save();
    })
    .then((ris) => {
      console.log("saved order");
      return req.user.clearCart();
    })
    .then(() => {
      console.log(" Cart Claered");
      res.redirect("/orders");
    });
};

exports.getOrders = (req, res, next) => {
  
  console.log("MID GET ORDERS");
  Order.find({ "user.userId": req.user._id })
    .then((order) => {
      console.log(order);
      console.log("data fetched");
      res.render("shop/orders", {
        pageTitle: "orders",
        path: "/orders",
        order,
        isAuthenticated:req.session.isLoggedIn
      });
    })
    .catch((err) =>{ console.log(err, "getting order data")
    return next(new Error(err));});
};
exports.getCheckout = (req, res, next) => {
  
  console.log("MID CHECKOUT");
  res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" , isAuthenticated:req.session.isLoggedIn});
};

exports.postDEletefromcart = (req, res, next) => {
  console.log("MID Delete CART");
  const productId = req.body.productId;
  const entire = req.body.entire == "true";
  req.user
    .delFromCart(productId, entire)
    .then((ris) => {
      console.log("Deleted cart successfully");
      res.redirect("/cart");
    })
    .catch((err) =>{ console.log(err, "Deleting Cart")
    return next(new Error(err));});
};

exports.cartUpdate=  (req,res,next)=>{
  
  const cartId=req.user.cartProductExist()
  Product.find().select('_id').then(async ris=>{
    console.log(cartId)
    console.log(ris)
    let exist=ris.map(x=>x._id.toString())
    console.log(exist)
    for(let val of cartId){
      console.log(val)
      let check=exist.includes(val.toString())
      console.log(check)
      if(!check){
  
        await req.user.delFromCart(val,true).then(ris=>console.log("Deleted from cart"))
      }     
      
    }
    console.log("finished")
    next()
    
    
  }).catch(err=>{
    return next(new Error(err));
  })
  
  
}

exports.getInvoice=async (req,res,next)=>{
  try{
  console.log("Mid get invoice",req.params.orderId)

  const orderId=req.params.orderId;
  const order= await Order.findById(orderId)

  if(order.user.userId.toString() != req.user._id.toString()){
    return next(new Error('Unauthorized'))
  }
   //const invoiceFile='invoice-'+orderId+'.pdf'
   const invoiceName='sample.pdf'
   const invoicePath=path.join('data','invoices',invoiceName)
   console.log(invoicePath)
   
   //for small files 
  // fs.readFile(invoicePath,(err,data)=>{
  //   if(err){
  //     return next(err)
  //   } 
  //   res.setHeader('Content-Type', 'application/pdf') 
  //   res.setHeader('Content-Disposition','inline; filename=" '+ invoiceFile+ '"')
  //   res.end(data)
  // })

  //large files -storage efficiency
  const file=fs.createReadStream(invoicePath)
   res.setHeader('Content-Type', 'application/pdf') 
   res.setHeader('Content-Disposition','inline; filename=" '+ invoiceName + '"')
   file.pipe(res)

   //more safe is 
//  res.sendFile(invoicePath,{root:'.'})

  



}catch(err){
  return next(err)
}




}
