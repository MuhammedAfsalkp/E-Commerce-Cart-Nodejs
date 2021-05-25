const productModel = require("../models/product");
exports.getAddproduct = (req, res, next) => {
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

  const obj = new  productModel.Product(null,title, imageurl, price, description);
  //now we have  some async file opration (read write read)  ,so to work coorrectly perform those only after the correct saving,so i use the callback
  //without any arguments,only for knowing that save has finished ,then go to main page that start to read the file only after iy
  obj.save(() => {
    console.log("post done");
    res.redirect("/admin/products");
  });
};
exports.getEditproduct = (req, res, next) => {
  console.log(req.params.productId, req.query.edit);
  console.log("Mid edit product");
  let productId = req.params.productId;
   productModel.Product.fetchbyid(productId, (product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/admin/edit-product",
      product,
    });
  });
};

exports.postEditproduct = (req,res,next)=>{
  console.log("MID post Edit ",req.body)
  const productId= req.body.productId;
  const title = req.body.product;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  const obj=new productModel.Product(productId,title,imageurl,price,description)
  obj.save(()=>{
    console.log("Edited")
    res.redirect('/admin/products')
  })


}

exports.getProducts = (req, res, next) => {
  console.log("MID admin PRODUCTLIST");
  productModel.Product.fetchall((product) => {
    console.log(product);
    res.render("admin/product", {
      product,
      pageTitle: "Products List",
      path: "/admin/products",
    });
  });
};

exports.postDeleteproduct = (req,res,next)=>{
  console.log("MID Post delete product")
  const productID=req.body.productId
  productModel.Product.deleteByid(productID,()=>{
    console.log("Deleted")
    res.redirect("/admin/products")

  })

}
