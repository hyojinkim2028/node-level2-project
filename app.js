const express = require('express')
const path = require('path')
const morgan = require('morgan')
const nunjucks = require('nunjucks')

const connect = require('./schemas')
const indexRouter = require('./routes/index')
const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')

const app = express()
app.set('view engine', 'html')
nunjucks.configure('views', {
  express: app,
  watch: true,
})
connect()

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)

app.listen(8080, () => {
  console.log('8080포트 열렸습니다!')
})
