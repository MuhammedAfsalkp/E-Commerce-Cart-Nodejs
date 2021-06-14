const Product = require("../models/product");
const { validationResult } = require("express-validator");
const {deleteFile}=require('../Utils/file')

exports.getAddproduct = (req, res, next) => {
  console.log("MID admin GET add-product");
  let invalid = null;
  let message = req.flash("error");
  let oldInput = req.session.oldInput
    ? req.session.oldInput
    : { title: "",  price: "", description: "" };
  req.session.oldInput = null;
  console.log(message);
  if (message.length > 0) {
    message = message[0];
    if (message.includes("Title")) {
      invalid = "Title";
    }
    if (message.includes("Image")) {
      invalid = "Image";
    }
    if (message.includes("Price")) {
      invalid = "Price";
    }
    if (message.includes("Description")) {
      invalid = "Description";
    }
  } else {
    message = null;
  }

  res.render("admin/add-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
    oldInput,
    invalid,
  });
};

exports.postAddproduct = async (req, res, next) => {
  try {
    console.log("Mid admin  POST add-product;-", req.body);
    const title = req.body.product;
    // const imageurl = req.body.imageurl;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const userId = req.user._id;
    
    const oldInput = { title,  price, description };
    console.log(image)
    if(!image){
      req.flash("error", `Select Image`);
      req.session.oldInput = oldInput;
      return req.session.save((err) => {
        res.redirect(`/admin/add-product`);
      });
    }
     const imageurl=image.path;

    let arr = validationResult(req).array();
    console.log(arr);
    if (arr.length > 0) {
      req.flash("error", `${arr[0].msg}`);
      req.session.oldInput = oldInput;
      return req.session.save((err) => {
        res.redirect(`/admin/add-product`);
      });
    }
    const product = new Product({
      title: title,
      imageurl: imageurl,
      price: price,
      description: description,
      userId: userId,
    });
    await product.save();
    console.log("product created");
    res.redirect("/admin/products");
  } catch (err) {
    req.flash("error", `${err}`);
    req.session.save((e) => {
      if (e) {
        next(new Error(err));
      }
      res.redirect("/500");
    });
  }
};
exports.getEditproduct = (req, res, next) => {
  console.log("Mid edit product");
  let invalid = null;
  let message = req.flash("error");
  let oldInput = req.session.oldInput
    ? req.session.oldInput
    : { title: "", imageurl: "", price: "", description: "" };
  req.session.oldInput = null;
  console.log(message);
  if (message.length > 0) {
    message = message[0];
    if (message.includes("Title")) {
      invalid = "Title";
    }
    if (message.includes("Imageurl")) {
      invalid = "Imageurl";
    }
    if (message.includes("Price")) {
      invalid = "Price";
    }
    if (message.includes("Description")) {
      invalid = "Description";
    }
  } else {
    message = null;
  }

  console.log(req.params.productId, req.query.edit);
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit product",
        path: "/admin/edit-product",
        product,
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        oldInput,
        invalid,
      });
    })
    .catch((err) => {
      req.flash("error", `${err}`);
      req.session.save((e) => {
        if (e) {
          next(new Error(err));
        }
        res.redirect("/500");
      });
    });
};

exports.postEditproduct = async (req, res, next) => {
  try {
    console.log("MID post Edit ", req.body);
    const productId = req.body.productId;
    const title = req.body.product;
    const image = req.file
    const price = req.body.price;
    const description = req.body.description;
    const oldInput = { title, image, price, description };
    let arr = validationResult(req).array();
    console.log(arr);
    if (arr.length > 0) {
      req.flash("error", `${arr[0].msg}`);
      req.session.oldInput = oldInput;
      return req.session.save((err) => {
        res.redirect(`/admin/edit-product/${productId}`);
      });
    }
    let product = await Product.findById(productId);
    console.log(typeof product.userId, typeof req.user._id);
    if (product.userId.toString() !== req.user._id.toString()) {
      req.flash("error", "You are not authorized to edit this product");
      return req.session.save((err) => {
        res.redirect("/err");
      });
    }
    product.title = title;
    if(image){
      await deleteFile(product.imageurl)
      product.imageurl=image.path
    }
    product.description = description;
    product.price = price;
    await product.save();
    console.log("Updated");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err, "post edit product");
    req.flash("error", `${err}`);
    req.session.save((e) => {
      if (e) {
        next(new Error(err));
      }
      res.redirect("/500");
    });
  }
};

exports.getProducts = (req, res, next) => {
  console.log("MID admin PRODUCTLIST");

  Product.find({ userId: req.user._id })
    //.select('title -_id')
    //.populate('userId','name email -_id')
    .then((product) => {
      res.render("admin/product", {
        product,
        pageTitle: "Products List",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log("err getting product");
      req.flash("error", `${err}`);
      req.session.save((e) => {
        if (e) {
          next(new Error(err));
        }
        res.redirect("/500");
      });
    });
};

exports.postDeleteproduct = async (req, res, next) => {
  try{
  console.log("MID Post delete product");
  
  const productID = req.body.productId;
  let product=await Product.findById(productID)
  await deleteFile(product.imageurl)
  
   const ris=await  Product.deleteOne({ _id: productID, userId: req.user._id })
      //nothing matched
      if (ris.deletedCount == 0) {
        req.flash("error", "You are not authorized to Delete this product");
        return req.session.save((err) => {
          res.redirect("/err");
        });
      }

      console.log("Deleted", ris);
      res.redirect("/admin/products");
  }catch(err) {
      console.log(err, "deleting");
      req.flash("error", `${err}`);
      req.session.save((e) => {
        if (e) {
          next(new Error(err));
        }
        res.redirect("/500");
      });
    }
};
