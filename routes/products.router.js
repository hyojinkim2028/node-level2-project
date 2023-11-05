const express = require('express');
const Product = require('../schemas/products.schema');

const router = express.Router();

router
  .route('/')
  // 상품 작성
  .post(async (req, res, next) => {
    try {
      const products = await Product.create({
        goods: req.body.goods,
        content: req.body.content,
        status: req.body.status,
        seller: req.body.seller,
        password: req.body.password,
      });
      console.log(products);
      res.status(201).json(products);
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
      const products = await Product.find(
        {},
        { _id: 0, goods: 1, seller: 1, status: 1, createdAt: 1 }
      ).sort({ createdAt: -1 });
      res.json(products);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router
  .route('/:id')

  // 상품 상세 조회
  .get(async (req, res) => {
    const products = await Product.findOne(
      {
        _id: req.params.id,
      },
      { goods: 1, content: 1, seller: 1, status: 1, createdAt: 1 }
    );
    if (products) {
      // 입력 아이디값과 일치하는 상품 있으면 해당 상품 상세 반환
      res.json(products);
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
      const products = await Product.findOne({ _id: req.params.id });

      // 존재하는 값 없으면 에러 반환
      if (products === null) {
        return res
          .status(400)
          .json({ errorMessage: '존재하지 않는 상품입니다.' });
      }
      // 비밀번호 불일치시 에러 반환
      if (products.password !== req.body.password) {
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
      const products = await Product.findOne({ _id: req.params.id });

      // 존재하는 값 없으면 에러 반환
      if (products === null) {
        return res
          .status(400)
          .json({ errorMessage: '존재하지 않는 상품입니다.' });
      }

      // 비밀번호 불일치시 에러 반환
      if (products.password !== req.body.password) {
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
