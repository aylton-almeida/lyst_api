import * as express from 'express';
import { emailValidator, validate } from "../../utils/validation.utils";
import User, { userSchema } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Mail from '../../services/mailer';

const authHash = process.env.AUTH_HASH || 'AUTH_HASH';

class AuthController {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post('/user', validate(userSchema), this.createUser);
    this.router.post('/auth', validate(userSchema), this.authenticateUser);
    this.router.post('/forgot_password',validate(emailValidator), this.forgotPassword);
  }

  private static generateAuthToken(id: number) {
    return jwt.sign({ id }, authHash, {
      expiresIn: 604800, //Expires in a week
    });
  }

  createUser = async (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    try {
      if (await User.findOne({ where: { email } }))
        return res.status(422).send({ error: 'Email already in use' });

      const newUser = await User.create(req.body);
      return res.send({
        newUser,
        token: AuthController.generateAuthToken(newUser.id),
      });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  authenticateUser = async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(400).send({ error: 'User not found' });

    if (!(await bcrypt.compare(password, user!.password)))
      return res.status(400).send({ error: 'Invalid password' });

    user!.password = '';

    return res.send({ user, token: AuthController.generateAuthToken(user.id) });
  };

  forgotPassword = async (req: express.Request, res: express.Response) => {
    const { email, isTest } = req.body;

    try{
      const user = await User.findOne({ where: { email } });

      if (!user)
        return res.status(404).send({ error: 'User not found' });
    }

    Mail.to = email;
    return Mail.sendMail(isTest)
      .then(() => res.send({msg: 'E-mail sent'}))
      .catch(err => res.status(500).send({ error: 'Error while sending email' }));
  };
}

export default AuthController;
