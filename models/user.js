const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  let updateCart = this.cart;
  let existIndex = updateCart.items.findIndex(
    (val) => val.productId == productId
  );
  if (existIndex != -1) {
    updateCart.items[existIndex].quantity += 1;
  } else {
    updateCart.items.push({ productId: productId, quantity: 1 });
  }
  this.cart = updateCart;
  return this.save()
    .then((ris) => {
      console.log("Added to cart");
    })
    .catch((err) => console.log(err, "add to cart"));
};

userSchema.methods.delFromCart = function (productId,entire) {
  let updateCartItems = this.cart.items;
  let updateIndex = updateCartItems.findIndex(
    (val) => val.productId.toString() == productId.toString()
  );
  console.log(updateIndex)
  let quantityOne = updateCartItems[updateIndex].quantity;
  if (quantityOne == 1 || entire) {
    updateCartItems = updateCartItems.filter(
      (val) => val.productId.toString() != productId.toString()
    );
  } else {
    updateCartItems[updateIndex].quantity -=  1;
  }
  this.cart.items=updateCartItems;
  return this.save().then(ris=>{
    console.log("Deleted cart")
  })
};

userSchema.methods.clearCart=function(){
  this.cart={items:[]}
  return this.save()
}

userSchema.methods.cartProductExist=function(){
  let availableId=this.cart.items.map(val=>{
    return val.productId
  })
  return availableId

}

userSchema.methods.cartPrice=function(){
  
}

const model = mongoose.model("User", userSchema);
module.exports = model;

