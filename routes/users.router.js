const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const { Op } = require('sequelize');
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.post('/join', async (req, res) => {
  const { email, name, password, confirmPassword } = req.body;
  let regex = new RegExp('[a-z0-9]+@[a-z]+.+[a-z]{2,3}'); // 이메일 검증식

  if (!regex.test(email)) {
    res.status(400).send({
      errorMessage: '이메일 형식이 올바르지 않습니다.',
    });
    return;
  }

  if (password !== confirmPassword || password.length < 6) {
    res.status(400).send({
      errorMessage:
        '비밀번호 확인과 일치한 6자리 이상의 비밀번호를 입력해주세요.',
    });
    return;
  }

  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }, { name }],
    },
  });
  if (existsUsers.length) {
    res.status(400).send({
      errorMessage: '이메일 또는 닉네임이 이미 사용중입니다.',
    });
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  await User.create({ email, name, password: hash });
  res.status(201).send({
    Message: `회원가입이 정상적으로 처리되었습니다.가입된 유저 정보는 아래와 같습니다.`,
  });
});

//아이디 : ${id}, 이메일 : ${email}, 이름: ${name},`,
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

  res.status(200).send({
    Message: `로그인에 성공했습니다. ${jwt.sign(
      { id: user.id },
      process.env.SECRET_KEY,
      {
        expiresIn: '12h',
      }
    )},{아이디: ${user.id}, 이메일: ${user.email},  이름: ${user.name}}`,
  });
});

module.exports = router;
