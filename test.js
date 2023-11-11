// boolean타입의 상품 판매상태 'FOR_SALE' 또는 'SOLD_OUT' 로 변환해주는 함수
function getStatus(status) {
  if (status === true) {
    return (status = 'FOR_SALE');
  } else return (status = 'SOLD_OUT');
}

const express = require('express');
const Product = require('../models/product');

const router = express.Router();

router
  .route('/')
  // 상품 작성
  .post(async (req, res, next) => {
    try {
      const product = await Product.create({
        goods: req.body.goods,
        content: req.body.content,
        status: req.body.status,
        seller: req.body.seller,
        password: req.body.password,
      });

      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  // 상품 목록 조회
  .get(async (req, res, next) => {
    try {
      // 상품명, 작성자명, 상품 상태, 작성 날짜만 조회하기
      // 상품 목록은 작성 날짜를 기준으로 내림차순(최신순) 정렬
      const products = await Product.find({}).sort({ createdAt: -1 });

      const getProducts = products.map((product, idx) => {
        return {
          goods: product.goods,
          seller: product.seller,
          status: getStatus(product.status),
          createdAt: product.createdAt,
        };
      });

      res.json(getProducts);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router
  .route('/:id')

  // 상품 상세 조회
  .get(async (req, res) => {
    const product = await Product.findOne({
      _id: req.params.id,
    });

    if (product) {
      // 입력 아이디값과 일치하는 상품 있으면 해당 상품 상세 반환
      res.json([
        `
goods : ${product.goods}
seller : ${product.seller}
status : ${getStatus(product.status)}
createdAt : ${product.createdAt}
`,
      ]);
    } else {
      // 일치한 값 없으면
      res.status(400).json({ errorMessage: '상품 조회에 실패했습니다.' });
    }
  })

  // 상품 수정
  .put(async (req, res, next) => {
    // 상품 존재여부 확인 먼저
    try {
      // 수정할 상품 존재여부 확인
      const product = await Product.findOne({ _id: req.params.id });

      // 존재하는 값 없으면 에러 반환
      if (product === null) {
        return res
          .status(400)
          .json({ errorMessage: '존재하지 않는 상품입니다.' });
      }
      // 비밀번호 불일치시 에러 반환
      if (product.password !== req.body.password) {
        return res
          .status(400)
          .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
      }

      // 수정하는 코드
      const editProduct = await Product.updateOne(
        {
          _id: req.params.id,
        },
        {
          goods: req.body.goods,
          content: req.body.content,
          status: req.body.status,
          password: req.body.password,
        }
      );
      return res
        .status(200)
        .json({ message: '수정이 정상적으로 완료되었습니다.', editProduct });
    } catch (err) {
      console.error(err);
      next(err);
    }
  })

  // 상품 삭제
  .delete(async (req, res, next) => {
    try {
      const product = await Product.findOne({ _id: req.params.id });

      // 존재하는 값 없으면 에러 반환
      if (product === null) {
        return res
          .status(400)
          .json({ errorMessage: '존재하지 않는 상품입니다.' });
      }

      // 비밀번호 불일치시 에러 반환
      if (product.password !== req.body.password) {
        return res
          .status(400)
          .json({ errorMessage: '비밀번호가 일치하지 않습니다.' });
      }

      const deleteProduct = await Product.deleteOne({ _id: req.params.id });
      res
        .status(200)
        .json({ message: '삭제가 정상적으로 완료되었습니다.', deleteProduct });
    } catch (err) {
      console.error(err);
    }
  });

module.exports = router;
