import * as express from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import Category from '../models/category.model';
import models from '../models';
import { validate, idValidator } from '../../utils/validation.utils';
import { noteSchema } from '../models/note.model';

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
    this.router.get(`${this.path}/:id`, validate(idValidator), this.getNote);
    this.router.post('/categoryNotes', this.getCategoryNotes);
    this.router.post(this.path, validate(noteSchema), this.createNote);
    this.router.put(this.path, validate(noteSchema), this.updateNote);
    this.router.delete(`${this.path}/:id`, validate(idValidator), this.deleteNote);
  }

  getAllNotes = async (req: express.Request, res: express.Response) => {
    const { userId } = req.body;

    try {
      const notes = await models.note.findAll({
        where: { userId },
        order: [['updatedAt', 'DESC']],
        include: [{ model: Category, attributes: ['color'] }],
        raw: true,
      });
      return res.send(notes);
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  getNote = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    try {
      const note = await models.note.findByPk(id);
      if (note) return res.send(note);
      else return res.status(404).send({ error: 'Note not found' });
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
        raw: true,
      });
      return res.send(notes);
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  createNote = async (req: express.Request, res: express.Response) => {
    try {
      const note = await models.note.create(req.body);

      const newNote = await models.note.findByPk(note.id, {
        include: [{ model: Category, attributes: ['color'] }],
        raw: true,
      });

      return res.send(newNote);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: e.message });
    }
  };

  updateNote = async (req: express.Request, res: express.Response) => {
    try {
      const { id, title, content } = req.body;
      const [numUpdates] = await models.note.update(
        { title, content },
        {
          where: { id },
        },
      );
      if (numUpdates >= 1) return res.send({ msg: 'Note updated' });
      else return res.status(404).send({ error: 'Note not found' });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  deleteNote = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const numUpdates = await models.note.destroy({
        where: { id },
      });
      if (numUpdates >= 1) return res.send({ msg: 'Note deleted' });
      else return res.status(404).send({ error: 'Note not found' });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };
}

export default NoteController;
