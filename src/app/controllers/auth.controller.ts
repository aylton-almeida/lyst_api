import * as express from 'express';
import { authTokenValidator, emailValidator, validate } from '../../utils/validation.utils';
import { resetPassSchema, userSchema } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import Mail from '../../services/mailer';
import crypto from 'crypto';
import Category from '../models/category.model';
import models from '../models';

const authHash = process.env.AUTH_HASH || 'AUTH_HASH';

class AuthController {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post('/user', validate(userSchema), this.createUser);
    this.router.post('/auth', validate(userSchema), this.authenticateUser);
    this.router.post('/validateToken', validate(authTokenValidator), this.validateAuthToken);
    this.router.post('/forgot_password', validate(emailValidator), this.forgotPassword);
    this.router.post('/reset_password', validate(resetPassSchema), this.resetPassword);
  }

  private static generateAuthToken(id: number) {
    return jwt.sign({ id }, authHash, {
      expiresIn: 604800, //Expires in a week
    });
  }

  createUser = async (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    try {
      if (await models.user.findOne({ where: { email } }))
        return res.status(422).send({ error: 'Email already in use' });

      const user = await models.user.create(req.body);
      const category = await models.category.create({
        title: 'Not Categorized',
        color: '4287669422',
        userId: user.id,
      });
      return res.send({
        user,
        category,
        token: AuthController.generateAuthToken(user.id),
      });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  authenticateUser = async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    try {
      const user = await models.user.scope('includePassword').findOne({ where: { email } });

      if (!user) return res.status(404).send({ error: 'User not found' });

      if (!(await bcrypt.compare(password, user!.password)))
        return res.status(400).send({ error: 'Invalid password' });

      user.password = '';

      return res.send({ user, token: AuthController.generateAuthToken(user.id) });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  validateAuthToken = async (req: express.Request, res: express.Response) => {
    const { token } = req.body;
    jwt.verify(token, authHash, async (err: JsonWebTokenError, decoded: object) => {
      if (err) return res.status(401).send({ error: 'Token invalid' });
      else {
        // @ts-ignore
        const user = await models.user.findByPk(decoded.id);
        return res.send({ user });
      }
    });
  };

  forgotPassword = async (req: express.Request, res: express.Response) => {
    const { email, isTest } = req.body;

    try {
      const user = await models.user.findOne({ where: { email } });

      if (!user) return res.status(404).send({ error: 'User not found' });

      const token = crypto.randomBytes(3).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await models.user.update(
        {
          passwordResetToken: token,
          passwordResetExpire: now,
        },
        { where: { id: user.id } },
      );

      Mail.to = email;
      Mail.context = { token };
      return Mail.sendMail(isTest)
        .then(() => res.send({ msg: 'E-mail sent', token: isTest ? token : null }))
        .catch(err => res.status(500).send({ error: 'Error while sending email', err }));
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  resetPassword = async (req: express.Request, res: express.Response) => {
    const { email, token, password } = req.body;

    try {
      const user = await models.user.scope('includePasswordResets').findOne({ where: { email } });

      if (!user) return res.status(404).send({ error: 'User not found' });

      if (token !== user.passwordResetToken)
        return res.status(401).send({ error: 'Invalid Token' });

      const now = new Date(Date.now());

      if (now.getTime() > new Date(user.passwordResetExpire).getTime())
        return res.status(400).send({ error: 'Token expired' });

      user.password = password;

      await user.save();

      res.send({ msg: 'Password updated' });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };
}

export default AuthController;
