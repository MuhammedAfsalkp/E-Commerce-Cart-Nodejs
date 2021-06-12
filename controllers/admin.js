const Product=require('../models/product')
const {validationResult}=require('express-validator')

exports.getAddproduct = (req, res, next) => {
  console.log("MID admin GET add-product");
  let invalid=null;
  let message=req.flash('error')
  let oldInput=(req.session.oldInput)?req.session.oldInput:{title:"",imageurl:"",price:"",description:""}
  req.session.oldInput=null;
  console.log(message)
  if(message.length>0){
    message=message[0]
    if(message.includes('Title')){  invalid='Title'  }
    if(message.includes('Imageurl')){  invalid='Imageurl'  }
    if(message.includes('Price')){  invalid='Price'  }
    if(message.includes('Description')){  invalid='Description'  }

  }else{
    message=null;
  }

  
  res.render("admin/add-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    isAuthenticated:req.session.isLoggedIn,
    errorMessage:message,
    oldInput,
    invalid
  });
};

exports.postAddproduct = (req, res, next) => {
  console.log("Mid admin  POST add-product;-", req.body);
  const title = req.body.product;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  const userId=req.user._id
  const oldInput={title,imageurl,price,description}
  let arr=validationResult(req).array()
  console.log(arr)
  if(arr.length > 0 ){
    req.flash('error',`${arr[0].msg}`)
    req.session.oldInput=oldInput
    return req.session.save(err=>{
      res.redirect(`/admin/add-product`)
    })
  }
  
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
  console.log("Mid edit product");
  let invalid=null;
  let message=req.flash('error')
  let oldInput=(req.session.oldInput)?req.session.oldInput:{title:"",imageurl:"",price:"",description:""}
  req.session.oldInput=null;
  console.log(message)
  if(message.length>0){
    message=message[0]
    if(message.includes('Title')){  invalid='Title'  }
    if(message.includes('Imageurl')){  invalid='Imageurl'  }
    if(message.includes('Price')){  invalid='Price'  }
    if(message.includes('Description')){  invalid='Description'  }

  }else{
    message=null;
  }
  
  console.log(req.params.productId, req.query.edit);
  const productId = req.params.productId;
   Product.findById(productId).then(product=>{
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/admin/edit-product",
      product,
      isAuthenticated:req.session.isLoggedIn,
      errorMessage:message,
      oldInput,
      invalid
     
    });

   })
   
 
};

exports.postEditproduct =async (req,res,next)=>{
  console.log("MID post Edit ",req.body)
  const productId= req.body.productId;
  const title = req.body.product;
  const imageurl = req.body.imageurl;
  const price = req.body.price;
  const description = req.body.description;
  const oldInput={title,imageurl,price,description}
  let arr=validationResult(req).array()
  console.log(arr)
  if(arr.length > 0 ){
    req.flash('error',`${arr[0].msg}`)
    req.session.oldInput=oldInput
    return req.session.save(err=>{
      res.redirect(`/admin/edit-product/${productId}`)
    })
  }
  try{
  let product = await Product.findById(productId)
  console.log( typeof product.userId,typeof req.user._id)
    if(product.userId.toString() !== req.user._id.toString()){
      req.flash('error','You are not authorized to edit this product')
      return req.session.save(err=>{
        res.redirect('/err')
      })
    }
    product.title=title;
    product.imageurl=imageurl;
    product.description=description;
    product.price=price;
    await product.save()
    console.log("Updated")
    res.redirect('/admin/products')  
    }catch(err){
    console.log(err,"post edit product")
    res.redirect("/admin/products")
   }
 
 }

exports.getProducts = (req, res, next) => {
  console.log("MID admin PRODUCTLIST");
 
  Product.find({userId:req.user._id})
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
  Product.deleteOne({_id:productID,userId:req.user._id}).then(ris=>{
    //nothing matched
    if(ris.deletedCount == 0){
      req.flash('error','You are not authorized to Delete this product')
      return req.session.save(err=>{
        res.redirect('/err')
      })

    }
    
    console.log("Deleted",ris)
    res.redirect("/admin/products")
  }).catch(err=>console.log(err,"deleting"))
}

