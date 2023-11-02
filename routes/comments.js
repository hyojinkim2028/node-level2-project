const express = require('express')
const Post = require('../schemas/post')
const Comment = require('../schemas/comment')

const router = express.Router()

router.route('/').post(async (req, res, next) => {
  try {
    const comment = await Comment.create({
      postId: req.body.postId,
      commenterName: req.body.commenterName,
      comment: req.body.comment,
    })
    console.log(comment)
    res.status(201).json(comment)
  } catch (err) {
    console.error(err)
    //   next(err)
  }
})

router
  .route('/:id')
  .put(async (req, res, next) => {
    try {
      const editComment = await Comment.updateOne(
        {
          _id: req.params.id,
        },
        {
          //   commenterName: req.body.commenterName,
          comment: req.body.comment,
        }
      )
      res.json(editComment)
    } catch (err) {
      console.error(err)
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      const deleteComment = await Comment.deleteOne({ _id: req.params.id })
      res.json(deleteComment)
    } catch (err) {
      console.error(err)
      next(err)
    }
  })

module.exports = router
