import * as express from 'express';
import Category, { categorySchema } from "../models/category.model";
import { validate, idValidator } from '../utils/validation.utils';

class CategoryController {
  public path = '/category';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getCategories);
    this.router.get(`${this.path}/:id`, validate(idValidator), this.getCategory);
    this.router.post(this.path, validate(categorySchema), this.createCategory);
    this.router.put(this.path, validate(categorySchema), this.updateCategory);
    this.router.delete(`${this.path}/:id`, validate(idValidator), this.deleteCategory);
  }

  getCategories = async (req: express.Request, res: express.Response) => {
    try {
      const categories = await Category.findAll();
      res.send(categories);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  };

  getCategory = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (category) res.send(category);
      else res.status(404).send({ error: 'Category not found' });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  };

  createCategory = async (req: express.Request, res: express.Response) => {
    try {
      const newCategory = await Category.create(req.body);
      res.send(newCategory);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  };

  updateCategory = async (req: express.Request, res: express.Response) => {
    try {
      const { id, title, color } = req.body;
      const [numUpdates] = await Category.update(
        { title, color },
        {
          where: { id },
        }
      );
      if (numUpdates === 1) res.send({ msg: 'Category updated' });
      else res.status(404).send({ error: 'Category not found' });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  };

  deleteCategory = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const numDestroyed = await Category.destroy({ where: { id } });
      if (numDestroyed === 1) res.send({ msg: 'Category deleted' });
      else res.status(404).send({ error: 'Category not found' });
    } catch (e) {
      console.log(e);
      res.status(500).send({ error: e.message });
    }
  };
}

export default CategoryController;
