import * as express from 'express';
import { validate } from '../utils/validation.utils';
import User, { userSchema } from '../models/user.model';

class AuthController {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, validate(userSchema), this.createUser);
  }

  createUser = async (req: express.Request, res: express.Response) => {
    const { email } = req.body;
    try {
      if (await User.findOne({ where: { email } }))
        res.status(422).send({ error: 'Email already in use' });

      const newUser = await User.create(req.body);
      res.send(newUser);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  };
}

export default AuthController;
