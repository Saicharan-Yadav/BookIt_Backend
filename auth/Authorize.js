const JWT = require('jsonwebtoken')

function AuthorizeUser(req, res, next) {

  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.json({ msg: 'Unauthorized' })
  }

  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer') {
    return res.json({ msg: 'Unauthorized' })
  }

  try {
    const decoded = JWT.verify(token, 'jwtSecret')
    req.user = decoded.user
    next()
  } catch (err) {
    return res.json({ msg: 'Unauthorized' })
  }
}

module.exports = AuthorizeUser