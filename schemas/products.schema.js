const mongoose = require('mongoose');

const { Schema } = mongoose;
const productSchema = new Schema({
  goods: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  seller: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
