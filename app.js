const express = require('express');
const path = require('path');
const morgan = require('morgan');
// const dotenv = require('dotenv');

const connect = require('./schemas');
const productsRouter = require('./routes/products.router');

const app = express();

connect();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/products', productsRouter);

app.listen(2000, () => {
  console.log('2000포트 열렸습니다!');
});
