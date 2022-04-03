const util = require('../util/utils');
const moment = require('moment');

const authRoute = async (req, res, next) => {
  if (req.path === '/login') {
    return next();
  }

  const [bearer, token] = req.headers.authorization.split(' ')
  if (bearer === 'bearer' || token.trim('') === '') {
    return res.status(403).json({ message: 'forbidden1' });
  }

  let keys = {}
  try {
    keys = JSON.parse(util.descryptographic(token))
  } catch (e) {
    return res.status(403).json({ message: 'invalid token' });
  }

  if (moment().diff(keys.expired) > 0) {
    return res.status(403).json({ message: 'token expired' });
  }

  const verifyToken = await util.getUser({
    id: keys.id
  })

  if (verifyToken.t) {
    return next();
  }
  return res.status(403).json({ message: 'forbidden2' });
}


module.exports = {
  authRoute
}