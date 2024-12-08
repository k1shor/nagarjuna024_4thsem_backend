const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({
    product_name: {
        type: String, 
        required: true, 
        trim: true
    },
    product_price:{
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    product_image: {
        type: String
    },
    category: {
        type: ObjectId,
        ref: "Category"
    }
}, {timestamps: true})

module.exports = mongoose.model("Product", productSchema)