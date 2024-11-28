const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String, require: true },
    description: { type: String },
    price: { type: Number, require: true },
    image: { type: String },
    category: { type: String },
    availibility: { type: String },
    brand: { type: String },
    type: { type: String },
    color: { type: String },
    rate: { type: Number }, // Sửa `Int32` thành `Number` để phù hợp với Mongoose
    createAt: { type: Date, default: Date.now } // Thêm trường thời gian tạo
});


module.exports = mongoose.model('Product', Product);