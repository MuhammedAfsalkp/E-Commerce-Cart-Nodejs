const productModel = require("../models/product");
exports.getAddproduct = (req, res, next) => {
  console.log(req.user._id)
  console.log("MID admin GET add-product");
  res.render("admin/add-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
  });
};

exports.postAddproduct = (req, res, next) => {
  console.log("Mid admin  POST add-product;-", req.body);
  const title = req.body.product;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  const userId=req.user._id
 

  const product = new  productModel.Product(title, imageurl, price, description,null,userId);
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
  let productId = req.params.productId;
   productModel.Product.fetchbyid(productId).then(product=>{
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/admin/edit-product",
      product,
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
  const userId=req.body.userId
  const obj=new productModel.Product(title,imageurl,price,description,productId,userId)
  obj.save().then(ris=>{
    console.log("Updated")
    res.redirect('/admin/products')
  })
 }

exports.getProducts = (req, res, next) => {
  console.log("MID admin PRODUCTLIST");
  productModel.Product.fetchall().then(product=>{
    res.render("admin/product", {
      product,
      pageTitle: "Products List",
      path: "/admin/products",
    });
  })
    
  
};

exports.postDeleteproduct = (req,res,next)=>{
  console.log("MID Post delete product")
  const productID=req.body.productId
  productModel.Product.deletebyid(productID).then(ris=>{
    console.log("Deleted")
    res.redirect("/admin/products")
  }).catch(err=>{
    console.log(err,"Deleting..")
  })

}

