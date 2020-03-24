import * as express from 'express';
import jwt from 'jsonwebtoken';

const authHash = process.env.AUTH_HASH || 'AUTH_HASH';

export default (req: express.Request, res: express.Response, next: Function) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: 'No token provided' });

  const parts = authHeader.split(' ');
  const [scheme, token] = parts;

  // Testing if starts with Bearer
  if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: 'Token malformed' });

  jwt.verify(token, authHash, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token invalid' });

    // @ts-ignore
    req.body.userId = decoded.id;
    return next();
  });
};
