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

app.use('/auth', usersRouter);
app.use('/goods', goodsRouter);

// 에러처리
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
  error.status = 404
  next(error)
})

app.listen(2000, () => {
  console.log('2000포트 열렸습니다!');
});
