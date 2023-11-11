const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Op } = require('sequelize');
const { User } = require('../models/index');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.post('/join', async (req, res) => {
  const { userId, email, nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: '패스워드가 패스워드 확인란과 다릅니다.',
    });
    return;
  }

  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }, { nickname }],
    },
  });
  if (existsUsers.length) {
    res.status(400).send({
      errorMessage: '이메일 또는 닉네임이 이미 사용중입니다.',
    });
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  await User.create({ userId, email, nickname, password: hash });
  res.status(201).send({ Message: '회원가입이 정상적으로 처리되었습니다.' });
});

// 로그인

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  const auth = await bcrypt.compare(password, user.password);

  // 사용자가 존재하지 않거나, 입력받은 비밀번호가 사용자의 비밀번호화 다를때
  if (!user || !auth) {
    res.status(400).send({
      errorMessage: '이메일 또는 패스워드가 틀렸습니다.',
    });
    return;
  }

  res.send({
    token: jwt.sign({ userId: user.userId }, 'sparta-secret-key', {
      expiresIn: '12h',
    }),
  });
});

const authMiddleware = require('../middlewares/auth-middleware');
const user = require('../models/user');

router.get('/users/me', authMiddleware, async (req, res) => {
  res.status(200).send({ message: '인증완료!' });
});

module.exports = router;
