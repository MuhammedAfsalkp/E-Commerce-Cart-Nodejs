const path = require("path");
const fs = require("fs");
const Product=require('./product')
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);
const getFilecontent = (callback) => {
  fs.readFile(p, (err, data) => {
    if (err) {
      callback({ products: [], totalprice: 0 });
    } else {
      let cart;
      try {
        cart = JSON.parse(data);
      } catch {
        cart = { products: [], totalprice: 0 };
      }
      callback(cart);
    }
  });
};

module.exports = class Cart {
  static addToCart(id, price, callback) {
    getFilecontent((cart) => {
      let existing = cart.products.find((prod) => id === prod.productId);
      if (existing) {
        existing.qty = parseInt(existing.qty) + 1;
        cart.products.forEach((val, index) => {
          if (val.id == id) {
            cart.products[index].qty = existing.qty;
            //cart.products[index.price] = price;
          }
        });
      } else {
        let updateItem = { productId: id, qty: 1 };
        cart.products = [...cart.products, updateItem];
      }
      cart.totalprice = parseFloat(cart.totalprice) + parseFloat(price);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err, "writing cart");
        }
        
        callback();
      });
    });
  }

  static fetchall(cb) {
    getFilecontent(cb);
  }

  static deleteCartById(entire, productId,callback) {
    getFilecontent((cart) => {
      console.log(cart)
      console.log("cart got",entire)
      const index = cart.products.findIndex(
        (val) => val.productId == productId
      );
      if (cart.products[index].qty == 1 || entire ) {
        let update = cart.products.filter((val) => val.productId != productId);
        cart.products = update;
      } else {
        cart.products[index].qty = parseInt(cart.products[index].qty) - 1;
      }
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) console.log(err, "on writing cart after delete by id");
        callback();
      });
    });
  }

  
  static getCartData(cb) {
    getFilecontent((cart) => {
      console.log(cart)
      if (cart == { products: [], totalprice: 0 }) {
        cb([]);
      }
      let data = [];
      Product.fetchall((product) => {
        for (let c of cart.products) {
          let exist = product.find((val) => {
            return val.productId == c.productId;
          });
          if (exist) {
            data.push({ ...exist, qty: c.qty });
          }
        }
        cb(data);
      });
    });
  }

     
};



// static deleteCartById(entire, productId, price, callback) {
//   getFilecontent((cart) => {
//     console.log(cart)
//     console.log("cart got",entire)
//     cart.totalprice = parseFloat(cart.totalprice) - parseFloat(price);
//     const index = cart.products.findIndex(
//       (val) => val.productId == productId
//     );
//     if (cart.products[index].qty == 1 || entire ) {
//       let update = cart.products.filter((val) => val.productId != productId);
//       cart.products = update;
//     } else {
//       cart.products[index].qty = parseInt(cart.products[index].qty) - 1;
//     }
//     fs.writeFile(p, JSON.stringify(cart), (err) => {
//       if (err) console.log(err, "on writing cart after delete by id");
//       callback();
//     });
//   });
// }











































