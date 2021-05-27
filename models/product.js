const getDb = require("../Utils/database").getDb;
// const cartModel = require("./cart");
const ObjectId=require('mongodb').ObjectId

class Product {
  constructor(title, imageurl, price, description,productId,userId) {
    this.title = title;
    this.imageurl = imageurl;
    this.price = price;
    this.description = description;
    if(productId){
    this._id= ObjectId( productId)
    }
    this.userId=new ObjectId(userId)
  }

  save() {
    const Db = getDb();
    const products = Db.collection("products");
    let op;
    console.log(this._id)
    if(this._id){
      console.log("if")
       op=products.updateOne({_id:this._id},{$set:this})
    }
    else{
      console.log("else")
       op=products.insertOne(this)

    }
   
    return op
      .then((result) => {
        console.log(result);
        return result
      })
      .catch((err) => {
        console.log(err, "insrerting");
        return err;
      });
  }

  static fetchall() {
    const Db = getDb();
    const products = Db.collection("products");
    return products
      .find({})
      .toArray()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch(err=>{
        console.log(err,"fetchall")
      })
  }

  static fetchbyid(id) {
    const Db = getDb();
    const products = Db.collection("products");
    console.log("fetching..." ,id)
    return products.findOne({_id:new ObjectId(id)}).then(product=>{
      console.log(new ObjectId(id))
      console.log(product)
      return product
    }).catch(err=>{console.log(err,"fetchbyid")})
  }

  static deletebyid(id){
    const Db=getDb();
    const products=Db.collection("products")
    return products.deleteOne({_id:new ObjectId(id)}).then(res=>{
      console.log("Deleting...")
    }).catch(err=>{
      console.log(err)

  })
}
}

exports.Product = Product;
