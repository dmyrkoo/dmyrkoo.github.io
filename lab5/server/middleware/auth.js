const { auth } = require('../config/firebaseAdmin');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';

    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing Bearer token' });
    }

    const token = header.replace('Bearer ', '').trim();
    const decodedToken = await auth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

const verifyToken = requireAuth;

module.exports = { requireAuth, verifyToken };

