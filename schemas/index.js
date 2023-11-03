const mongoose = require('mongoose');

const connect = () => {
  mongoose
    .connect('mongodb://root:1214@localhost:27017/admin?authSource=admin', {
      dbName: 'productProject',
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('몽고디비 연결 성공');
    })
    .catch((err) => {
      console.log('몽고디비 연결 에러', err);
    });
};
mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 에러', err);
});

module.exports = connect;
