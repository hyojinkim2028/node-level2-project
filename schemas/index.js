const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// db 아이디, 비밀번호 정보 보안
require('dotenv').config();
const connectUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rywpqas.mongodb.net/?retryWrites=true&w=majority`;

const connect = () => {
  mongoose
    .connect(connectUrl, {
      dbName: 'spa_mall',
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => {
      console.log('몽고디비 연결 성공');
    })
    .catch((err) => console.log(err));
};

mongoose.connection.on('error', (err) => {
  console.error('몽고디비 연결 에러', err);
});

module.exports = connect;
