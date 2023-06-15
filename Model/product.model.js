const mongoose=require("mongoose");
const Schema=mongoose.Schema

const postProduct = new Schema({
  productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      require:true
    },
    product_description:{
        type:String,
        require:true,
    },
    product_images: {
      type: String,
      required: true,
    },
    isActive:{
        type: Boolean,
        required: true,
    }
  });

const postProductModel=mongoose.model("postProduct",postProduct);

module.exports={postProductModel};