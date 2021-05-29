const Product = require("../models/product");
const Order = require("../models/order");
exports.getProducts = (req, res, next) => {
  console.log("MID PRODUCTLIST");
  Product.find().then((product) => {
    console.log("Got products");
    res.render("shop/product-list", {
      product,
      pageTitle: "Products List",
      path: "/products",
    });
  });
};
exports.getIndex = (req, res, next) => {
  console.log("MID index");
  Product.find().then((product) => {
    //console.log(product);
    res.render("shop/index", { product, pageTitle: "Home page", path: "/" });
  });
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
      });
    })
    .catch((err) => console.log(err, "fetching"));
};

exports.getCart = (req, res, next) => {
  console.log("MID CART");
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((data) => {
      console.log(data);
      console.log(data.cart.items);
      const product = data.cart.items;
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        price: 100,
        product,
      });
    })
    .catch((err) => console.log(err, "Getting cart data"));
};

exports.postCart = (req, res, next) => {
  console.log("Mid post CART");
  console.log(req.body.productId);
  const productId = req.body.productId;
  console.log(req.user, "postcart");
  req.user.addToCart(productId).then((ris) => {
    console.log("Aded to cart successsfully");
    res.redirect("/cart");
  });
};
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
          name: req.user.name,
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
      });
    })
    .catch((err) => console.log(err, "getting order data"));
};
exports.getCheckout = (req, res, next) => {
  console.log("MID CHECKOUT");
  res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
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
    .catch((err) => console.log(err, "Deleting Cart"));
};

exports.cartUpdate= (req,res,next)=>{
  const cartId=req.user.cartProductExist()
  Product.find().select('_id').then(async ris=>{
    console.log(cartId)
    console.log(ris)
    let exist=ris.map(x=>x._id.toString())
    console.log(exist)
    cartId.forEach(async (val)=>{
      console.log(val)
      let check=exist.includes(val.toString())
      console.log(check)
      if(!check){
  
        await req.user.delFromCart(val,true).then(ris=>console.log("Deleted from cart"))
      }     
      
    })
    console.log("finished")
    next()
    
    
  })
  
  
}
