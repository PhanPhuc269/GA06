const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: {type: String, require: true},
    description: {type: String},
    price: {type: Number, require: true},
    image: {type: String},
    category: {type: String},
    availibility: {type: String},

});

module.exports = mongoose.model('Product', Product);