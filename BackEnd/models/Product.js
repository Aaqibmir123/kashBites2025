import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true 
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        min: 0 
    },
    category: {
        type: String,
    },
    stock: {
        type: Number,
        default: 0, 
        min: 0
    },

    qty: { 
        type: Number,
        default: 1,     
        min: 1          
    }, 

    // ⭐ NEW FIELD — Discount
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },

    imageUrl: String 

}, { timestamps: true });

const Product = mongoose.model("ResturantProduct", productSchema);
export default Product;
