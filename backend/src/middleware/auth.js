const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const { User } = require('../models');
const logger = require('../utils/logger');

const tenantId = process.env.ENTRA_TENANT_ID;
const clientId = process.env.ENTRA_CLIENT_ID;

const jwksClient = jwksRsa({
  jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
  cache: true,
  cacheMaxAge: 86400000, // 24h
  rateLimit: true
});

function getSigningKey(header, callback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key.getPublicKey());
  });
}

async function authenticate(req, res, next) {
  // Dev mode: skip token validation, use a mock user
  if (process.env.AUTH_DISABLED === 'true') {
    const [user] = await User.findOrCreate({
      where: { entraId: 'dev-user' },
      defaults: {
        email: 'dev@localhost.dev',
        firstName: 'Dev',
        lastName: 'User',
        entraId: 'dev-user',
        role: 'admin'
      }
    });
    req.user = user;
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getSigningKey, {
        audience: clientId,
        issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
        algorithms: ['RS256']
      }, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    // Find or create user from token claims
    const [user] = await User.findOrCreate({
      where: { entraId: decoded.oid },
      defaults: {
        email: decoded.preferred_username || decoded.email,
        firstName: decoded.given_name || decoded.name?.split(' ')[0] || '',
        lastName: decoded.family_name || decoded.name?.split(' ').slice(1).join(' ') || '',
        entraId: decoded.oid
      }
    });

    // Update last login
    await user.update({ lastLogin: new Date() });

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth failed:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authenticate, requireAdmin };
