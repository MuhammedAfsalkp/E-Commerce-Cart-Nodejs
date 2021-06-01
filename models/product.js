const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageurl: {
    type: String,
    // required:true
  },
  description: {
    type: String,
    required: true,
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
});







const model=mongoose.model('Product',productSchema)
module.exports=model;

















