const express = require('express')
const Post = require('../schemas/post')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find({})
    res.render('index', { posts })
  } catch (err) {
    console.error(err)
    next(err)
  }
})

module.exports = router
