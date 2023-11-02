const mongoose = require('mongoose')

const { Schema } = mongoose

const commentSchema = new Schema({
  postId: {
    type: String,
  },
  commenterName: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Comment', commentSchema)
