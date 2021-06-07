const Product=require('../models/product')
exports.getAddproduct = (req, res, next) => {
   console.log("MID admin GET add-product");
  res.render("admin/add-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    isAuthenticated:req.session.isLoggedIn
  });
};

exports.postAddproduct = (req, res, next) => {
  console.log("Mid admin  POST add-product;-", req.body);
  const title = req.body.product;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  const userId=req.user._id
  const product=new Product({title:title,imageurl:imageurl,price:price,description:description,userId:userId})
  product.save()
 .then(()=>{
    console.log("product created",)
    res.redirect("/admin/products")
  })
  .catch(err=>{
    console.log(err)
  })
};
exports.getEditproduct = (req, res, next) => {
  
  console.log(req.params.productId, req.query.edit);
  console.log("Mid edit product");
  const productId = req.params.productId;
   Product.findById(productId).then(product=>{
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/admin/edit-product",
      product,
      isAuthenticated:req.session.isLoggedIn
     
    });

   })
   
 
};

exports.postEditproduct = (req,res,next)=>{
  console.log("MID post Edit ",req.body)
  const productId= req.body.productId;
  const title = req.body.product;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  Product.findById(productId).then(product=>{
    product.title=title;
    product.imageurl=imageurl;
    product.description=description;
    product.price=price;
     return product.save()
    }).then(ris=>{
      console.log("Updated")
      res.redirect('/admin/products')
    }).catch(err=>console.log(err))
 
 }

exports.getProducts = (req, res, next) => {
  console.log("MID admin PRODUCTLIST");
 
  Product.find()
  //.select('title -_id')
  //.populate('userId','name email -_id')
  .then(product=>{
    res.render("admin/product", {
      product,
      pageTitle: "Products List",
      path: "/admin/products",
      isAuthenticated:req.session.isLoggedIn
    });
  }) 
};

exports.postDeleteproduct = (req,res,next)=>{
  console.log("MID Post delete product")
  const productID=req.body.productId
  Product.findByIdAndRemove(productID).then(ris=>{
    
    console.log("Deleted")
    res.redirect("/admin/products")
  }).catch(err=>console.log(err,"deleting"))
}

