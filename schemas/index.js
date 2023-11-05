const mongoose = require('mongoose');
require('dotenv').config();
// 연결할 몽고디비 url 변수에 저장
const connectUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rywpqas.mongodb.net/?retryWrites=true&w=majority`;

const connect = () => {
  mongoose
    .connect(connectUrl, {
      dbName: 'spa_mall',
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
