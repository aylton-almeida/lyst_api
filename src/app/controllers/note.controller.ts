import * as express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import Note from '../models/note.model';

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
    this.router.get(this.path, this.getNotes);
    this.router.post('/categoryNotes', this.getCategoryNotes);
  }

  getNotes = async (req: express.Request, res: express.Response) => {
    const { userId } = req.body;

    try {
      const notes = await Note.findAll({
        where: { userId },
        order: [['updatedAt', 'DESC']],
      });
      return res.send(notes);
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  getCategoryNotes = async (req: express.Request, res: express.Response) => {
    const { userId, categoryId } = req.body;
  };
}

export default NoteController;
