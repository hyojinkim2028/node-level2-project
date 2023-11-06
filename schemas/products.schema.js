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
    default: true, // 상품 등록 시 기본 상태는 판매 중
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
