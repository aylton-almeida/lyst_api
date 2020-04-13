import * as express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import Category from '../models/category.model';
import models from '../models';

class NoteController {
  public path = '/note';
  public router = express.Router();

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  public initializeMiddlewares() {
    this.router.use(authMiddleware);
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllNotes);
    this.router.post('/categoryNotes', this.getCategoryNotes);
  }

  getAllNotes = async (req: express.Request, res: express.Response) => {
    const { userId } = req.body;

    try {
      const notes = await models.note.findAll({
        where: { userId },
        order: [['updatedAt', 'DESC']],
        include: [{ model: Category, attributes: ['color'] }],
        raw: true
      });
      return res.send(notes);
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  getCategoryNotes = async (req: express.Request, res: express.Response) => {
    const { userId, categoryId } = req.body;
    try {
      const notes = await models.note.findAll({
        where: { userId, categoryId },
        order: [['updatedAt', 'DESC']],
        include: [{ model: Category, attributes: ['color'] }],
        raw: true
      });
      return res.send(notes);
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };
}

export default NoteController;
