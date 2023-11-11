const express = require('express');
const { Op } = require('sequelize');
const { Goods } = require('../models/index');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { goodsId, goods, content, status } = req.body;

  if (!goodsId || !goods || !content || !status) {
    res.status(400).send({
      errorMessage: '상품 정보를 모두 작성해주세요.',
    });
    return;
  }

  await Goods.create({ goodsId, goods, content, userId, status });

  res.status(200).send({ Message: '등록 완료! ' });
  // const existsUsers = await User.findAll({
  //   where: {{ goodsId },
  //   },
  // });
  // if (existsUsers.length) {
  //   res.status(400).send({
  //     errorMessage: '이메일 또는 닉네임이 이미 사용중입니다.',
  //   });
  //   return;
  // }
  // const hash = await bcrypt.hash(password, 10);
  // await User.create({ userId, email, nickname, password: hash });
  // res.status(201).send({ Message: '회원가입이 정상적으로 처리되었습니다.' });
});

module.exports = router;
