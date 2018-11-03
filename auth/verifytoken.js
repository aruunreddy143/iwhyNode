const jwt = require('jsonwebtoken');
const config = require('../config/settings');
function verifyToken(req, res, next) {
  //console.log(req.headers.authorization);
  let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
  if (!token)
    return res.status(403).send({ auth: false, success: false, message: 'No token provided.' });

  let tokenRectify = token.substring(1);
  jwt.verify(tokenRectify, config.secret, function (err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, success: false, message: 'Failed to authenticate token.' });


    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}
module.exports = verifyToken;