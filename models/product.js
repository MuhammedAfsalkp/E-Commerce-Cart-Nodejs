const path = require("path");
const fs = require("fs");
const cartModel=require("./cart")
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getFilecontent = (callback) => {
  fs.readFile(p, (err, data) => {
    if (err) {
      console.log(err,"error data");
      callback([]);
    } else {
      let prod;
      try {
        prod = JSON.parse(data);
      } catch {
        prod = [];
      }
      callback(prod);
    }
  });
};

      class Product {
  constructor(productId, title, imageurl, price, description) {
    this.productId = productId;
    this.title = title;
    this.imageurl = imageurl;
    this.price = price;
    this.description = description;
  }

  save(callback) {
    if (this.productId) {
      getFilecontent((product) => {
        console.log("update");
        let existingIndex = product.findIndex(
          (val) => this.productId == val.productId
        );
        product[existingIndex] = this;
        fs.writeFile(p, JSON.stringify(product), (err) => {
          if (err) console.log(err, "on writing update");
          callback();
        });
      });
    } else {
      this.productId = Math.random().toString();
      getFilecontent((product) => {
        product.push(this);
        fs.writeFile(p, JSON.stringify(product), (err) => {
          if (err) {
            console.log(err, " on writing  ");
          }
          callback();
        });
      });
    }
  }

  static fetchall(callback) {
    console.log("fetchall");
    getFilecontent(callback);
  }

  static deleteByid(productId, callback) {
    getFilecontent((products) => {
      console.log("deleting...", productId);
      if (products == []) {
        callback();
      }
      const updadateProducts = products.filter(
        (val) => val.productId !== productId
      );
      cartModel.Cart.deleteCartById(true,productId,()=>{
        console.log(updadateProducts)
        fs.writeFile(p, JSON.stringify(updadateProducts), (err) => {
          if (err) console.log(err, "on write deleting");
          callback();
        });


      })
        

      
      
     
    });
  }
  static test(cb){
    cb("test")

  }

  static fetchbyid(id, callback) {
    getFilecontent((product) => {
      let filterProduct = product.find((value) => value.productId == id);
      callback(filterProduct);
    });
  }
}

exports.Product=Product;




