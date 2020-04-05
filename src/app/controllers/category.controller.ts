import * as express from 'express';
import Category, { categorySchema } from '../models/category.model';
import { validate, idValidator } from '../../utils/validation.utils';
import authMiddleware from '../middlewares/auth.middleware';

class CategoryController {
  public path = '/category';
  public router = express.Router();

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  public initializeMiddlewares() {
    this.router.use(authMiddleware);
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getCategories);
    this.router.get(`${this.path}/:id`, validate(idValidator), this.getCategory);
    this.router.post(this.path, validate(categorySchema), this.createCategory);
    this.router.put(this.path, validate(categorySchema), this.updateCategory);
    this.router.delete(`${this.path}/:id`, validate(idValidator), this.deleteCategory);
  }

  getCategories = async (req: express.Request, res: express.Response) => {
    const { userId } = req.body;
    try {
      const categories = await Category.findAll({ where: { userId } });
      return res.send(categories);
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  getCategory = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (category) return res.send(category);
      else return res.status(404).send({ error: 'Category not found' });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  createCategory = async (req: express.Request, res: express.Response) => {
    try {
      const newCategory = await Category.create(req.body);
      return res.send(newCategory);
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  //TODO: Shouldn't be able to edit 'Not Categorized'
  updateCategory = async (req: express.Request, res: express.Response) => {
    try {
      const { id, title, color } = req.body;
      const [numUpdates] = await Category.update(
        { title, color },
        {
          where: { id },
        }
      );
      if (numUpdates === 1) return res.send({ msg: 'Category updated' });
      else return res.status(404).send({ error: 'Category not found' });
    } catch (e) {
      return res.status(500).send({ error: e.message });
    }
  };

  deleteCategory = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const numDestroyed = await Category.destroy({ where: { id } });
      if (numDestroyed === 1) return res.send({ msg: 'Category deleted' });
      else return res.status(404).send({ error: 'Category not found' });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: e.message });
    }
  };
}

export default CategoryController;
