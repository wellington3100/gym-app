// backend/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'default_product.png'
  },
  category: {
    type: String,
    enum: ['membership', 'supplement', 'merch', 'service'],
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);