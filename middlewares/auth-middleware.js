const jwt = require('jsonwebtoken'); // jwt
const User = require('../models/user'); // 모델
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  const [authType, authToken] = (authorization || '').split(' ');

  if (!authToken || authType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
    return;
  }

  try {
    const { id } = jwt.verify(authToken, process.env.SECRET_KEY); // 암호화한 키 해독
    const user = await User.findByPk(id);
    res.locals.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({
      errorMessage: `로그인 후 이용 가능한 기능입니다.`,
    });
  }
};
