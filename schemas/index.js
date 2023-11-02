const mongoose = require('mongoose')

const connect = () => {
  mongoose
    .connect('mongodb://root:1214@localhost:27017/admin', {
      dbName: 'postProject',
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('몽고디비 연결 성공')
    })
    .catch((err) => {
      console.log('몽고디비 연결 에러', err)
    })
}

mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error)
})
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.')
})

module.exports = connect
