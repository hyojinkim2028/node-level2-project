const express = require('express')
const Post = require('../schemas/post')
const Comment = require('../schemas/comment')

const router = express.Router()

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const posts = await Post.find({})
      res.json(posts)
    } catch (err) {
      console.error(err)
      next(err)
    }
  })
  .post(async (req, res, next) => {
    try {
      const post = await Post.create({
        title: req.body.title,
        name: req.body.name,
        password: req.body.password,
        content: req.body.content,
      })
      console.log(post)
      res.status(201).json(post)
    } catch (err) {
      console.error(err)
      next(err)
    }
  })

router
  .route('/:id')
  // 게시글 상세 조회
  .get(async (req, res) => {
    const post = await Post.findOne({
      _id: req.params.id,
    })
    if (post) {
      // 입력 아이디값과 일치한 게시글 있으면 그 게시글 반환
      res.json({ post })
    } else {
      // 일치한 값 없으면
      res.status(400).json({ errorMessage: '게시글 조회에 실패했습니다.' })
    }
  })
  .put(async (req, res, next) => {
    try {
      const editPost = await Post.updateOne(
        {
          _id: req.params.id,
        },
        {
          title: req.body.title,
          name: req.body.name,
          password: req.body.password,
          content: req.body.content,
        }
      )
      res.json(editPost)
    } catch (err) {
      console.error(err)
      next(err)
    }
  })
  .delete(async (req, res, next) => {
    try {
      const deletePost = await Post.deleteOne({ _id: req.params.id })
      res.json(deletePost)
    } catch (err) {
      console.error(err)
    }
  })

router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
    console.log(comments)
    res.json(comments)
  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router
