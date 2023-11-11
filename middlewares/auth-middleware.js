const jwt = require('jsonwebtoken'); // jwt
const { User } = require('../models'); // 모델

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  const [authType, authToken] = (authorization || '').split(' ');

  if (!authToken || authType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, 'sparta-secret-key');
    User.findByPk(userId).then((user) => {
      res.locals.userId = user.userId;
      console.log(res.locals.user);
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: '로그인 후 이용 가능한 기능입니다.',
    });
  }
};
