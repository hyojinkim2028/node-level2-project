const express = require('express');

const { sequelize } = require('./models');
const usersRouter = require('./routes/users.router');
const goodsRouter = require('./routes/goods.router');

const app = express();
app.use(express.json());

// db연결
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use('/', usersRouter);
app.use('/goods', goodsRouter);

app.listen(2000, () => {
  console.log('2000포트 열렸습니다!');
});
