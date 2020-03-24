import * as express from 'express';
import { validate } from '../utils/validation.utils';
import User, { userSchema } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const authHash = process.env.AUTH_HASH || 'AUTH_HASH';

class AuthController {
  public userPath = '/user';
  public authPath = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.userPath, validate(userSchema), this.createUser);
    this.router.post(this.authPath, validate(userSchema), this.authenticateUser);
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
}

export default AuthController;
