const express = require('express');
const User = require('../models/user');
const Goods = require('../models/goods');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();

// 상품 전체조회
router.route('/').get(async (req, res) => {

  const getGoods = await Goods.findAll({})

  // 존재하는 상품 없을시 조기 리턴
  if (!getGoods) {
    res.status(404).send({
      errorMessage: '존재하는 상품이 없습니다.',
    });
    return;
  } 

  // 값이 없는 경우에는 최신순 정렬
  const sort = req.query.sort ? req.query.sort.toUpperCase() : 'DESC';

  // ASC, DESC 둘 다 해당하지 않을 경우 최신순 정렬
  if (sort !== 'ASC' && sort !== 'DESC') {
    sort = 'DESC';
  }
  try {
    const goods = await Goods.findAll({
      attributes: ['goods', 'content', 'UserId', 'status', 'createdAt'],
      order: [[['createdAt', sort]]],
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    res.send({ goods });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: '상품 목록 조회에 실패하였습니다.' });
  }
});

// 상품 상세조회
router.route('/:id').get(async (req, res) => {
  const getGoods = await Goods.findOne({
    attributes: ['goods', 'content', 'UserId', 'status', 'createdAt'],
    where: { id: req.params.id },
  });

  if (!getGoods) {
    res.status(404).send({
      errorMessage: '존재하지 않는 상품입니다.',
    });
  }

  res.status(200).send(getGoods);
});

// 상품 등록, 수정, 삭제 시 인증된 사용자만 접근 가능하게 함.
router.use(authMiddleware, (req, res, next) => {
  next();
});

router.route('/').post(async (req, res) => {
  // join 시 자동 생성되는 변수 (이렇게 담아야 테이블에 값이 조회됩니다!)
  const UserId = res.locals.user.id;

  const { goods, content, status } = req.body;

  if (!UserId) {
    res.status(400).send({
      errorMessage: '로그인을 해야 상품작성이 가능합니다.',
    });
    return;
  }

  if (!goods || !content || !status) {
    res.status(400).send({
      errorMessage: '상품 정보를 모두 작성해주세요.',
    });
    return;
  }

  // 상품상태는 for-sale 또는 sold-out만 입력 가능함
  if (status === 'for-sale' || status === 'sold-out') {
  } else {
    res.status(400).send({
      errorMessage:
        '상품 상태에는 for-sale 또는 sold-out 만 입력할 수 있습니다.',
    });
    return;
  }

  await Goods.create({ goods, content, UserId, status });

  res.status(200).send({ Message: '등록 완료! ' });
});

router
  .route('/:id')
  .put(async (req, res) => {
    const userId = res.locals.user.id;
    const getGoods = await Goods.findOne({
      where: { id: req.params.id },
    });

    const { goods, content, status } = req.body;

    if (!getGoods) {
      res.status(404).send({
        errorMessage: '해당하는 상품이 없습니다.',
      });
      return;
    }

    if (!goods || !content || !status) {
      res.status(400).send({
        errorMessage: '상품명, 작성 내용, 상품 상태를 모두 입력해주세요.',
      });
      return;
    }

    if (userId !== getGoods.UserId) {
      res.status(400).send({
        errorMessage: '해당 상품을 등록한 사용자만 수정 권한이 있습니다.',
      });
      return;
    }

    await Goods.update(
      {
        goods: req.body.goods,
        content: req.body.content,
        status: req.body.status,
      },
      {
        where: { id: req.params.id },
      }
    );

    res.status(201).send({ message: '상품 수정이 완료되었습니다.' });
  })
  .delete(async (req, res) => {
    const userId = res.locals.user.id;
    const getGoods = await Goods.findOne({
      where: { id: req.params.id },
    });

    if (!getGoods) {
      res.status(404).send({
        errorMessage: '해당하는 상품이 없습니다.',
      });
      return;
    }

    if (userId !== getGoods.UserId) {
      res.status(400).send({
        errorMessage: '해당 상품을 등록한 사용자만 삭제 권한이 있습니다.',
      });
      return;
    }

    await Goods.destroy({
      where: { id: req.params.id },
    });

    res.status(200).send({ Message: '상품 삭제가 완료되었습니다.' });
  });

module.exports = router;
