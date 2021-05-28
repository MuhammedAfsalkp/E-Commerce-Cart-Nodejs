const getDb = require("../Utils/database").getDb;
const ObjectId = require("mongodb").ObjectId;
const productModel = require("./product");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save() {
    const Db = getDb();
    const users = Db.collection("users");
    return users
      .insertOne(this)
      .then((risult) => {
        console.log(risult, "saved user");
        return risult;
      })
      .catch((err) => {
        console.log(err, "err on saving");
      });
  }
  addtoCart(productId) {
    const Db = getDb();
    const users = Db.collection("users");
    let cart = this.cart;
    let existIndex = cart.items.findIndex((val) => val._id == productId);
    if (existIndex != -1) {
      cart.items[existIndex].qty = parseInt(cart.items[existIndex].qty) + 1;
    } else {
      cart.items.push({ _id: new ObjectId(productId), qty: 1 });
    }
    return users
      .updateOne({ _id: this._id }, { $set: { cart: cart } })
      .then((ris) => {
        console.log("update success");
      })
      .catch((err) => console.log("update failed for cart", err));
  }
  getCartData() {
    const cartItems = this.cart.items;
    const Db = getDb();
    const products = Db.collection("products");
    let existId = cartItems.map((val) => val._id);
    console.log(existId);
    return products
      .find({ _id: { $in: existId } })
      .toArray()
      .then((prod) => {
        console.log(prod);
        return prod.map((val) => {
          let qty;

          cartItems.forEach((c) => {
            if (c._id.toString() == val._id.toString()) {
              qty = c.qty;
            }
          });
          // console.log(qty);

          return { ...val, quantity: qty };
        });
      });
  }
  delFromCart(productId, entire) {
    let cartItems = this.cart.items;
    const Db = getDb();
    const users = Db.collection("users");
    let updateIndex = cartItems.findIndex(
      (val) => val._id.toString() == productId.toString()
    );
    let quantityOne = cartItems[updateIndex].qty;
    if (quantityOne == 1 || entire) {
      cartItems = cartItems.filter(
        (val) => val._id.toString() != productId.toString()
      );
    } else {
      cartItems[updateIndex].qty = parseInt(cartItems[updateIndex].qty) - 1;
    }
    return users
      .updateOne({ _id: this._id }, { $set: { cart: { items: cartItems } } })
      .then((ris) => {
        console.log("Deleted cart successfully");
      })
      .catch((err) => {
        console.log("err deleting cart", err);
      });
  }
  addorder() {
    const Db = getDb();
    const orders = Db.collection("orders");
    return this.getCartData()
      .then((cartdata) => {
        console.log("1")
        let order = {
          items: cartdata,
          user: {
            userid: new ObjectId(this._id),
            name: this.name,
          },
        };      
       return orders.insertOne(order).then((ris) => {
          console.log("2")
        return ris;
      })
    })
      .then((ris) => {
        console.log("3")
        const Db = getDb();
        const users = Db.collection("users");
        return users.updateOne({ _id: this._id }, { $set: { cart: { items: [] } } }).then((suc) => {
        console.log("updated user also");
      })
     
    })
      .catch((err) => console.log(err));
    }
  getorder() {
    const Db = getDb();
    const orders = Db.collection("orders");
    return orders.find({'user.userid':this._id}).toArray().then(data=>{
      console.log(data)
      return data
    }).catch(err=>console.log(err,"getting order data"))
  
  }
  static findbyid(id) {
    const Db = getDb();
    const users = Db.collection("users");
    return users
      .findOne({ _id: new ObjectId(id) })
      .then((ris) => {
        console.log(ris, "user findbyid successfull");
        return ris;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
