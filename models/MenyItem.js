//schema för admin
const mongoose = require("mongoose");
const menySchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        enum: ["hot_drinks", "cold_drinks", "sandwich", "other"],
        default: "other",
    },
    description:{
        type: String
    },
    allergens:{
        type:String
    }
});

module.exports = mongoose.model("MenyItem", menySchema);