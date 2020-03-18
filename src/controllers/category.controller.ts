import * as express from 'express';
import Category from '../models/category.model';
import { checkSchema, param, ValidationChain } from 'express-validator';
import { validate } from '../utils/validation.utils';

class CategoryController {
  public path = '/category';
  public router = express.Router();
  public categorySchema: ValidationChain[] = checkSchema({
    id: {
      in: ['params', 'query', 'body'],
      isInt: true,
      errorMessage: 'Invalid Id',
      optional: {
        options: { nullable: true },
      },
    },
    title: {
      in: ['body'],
      isString: true,
      errorMessage: 'Invalid title',
    },
    color: {
      in: ['body'],
      isString: true,
      errorMessage: 'Invalid color',
      isLength: {
        errorMessage: 'Color must be between 3 and 6 chars long',
        options: { min: 3, max: 6 },
      },
    },
  });
  private idValidator: ValidationChain[] = [param('id', 'invalid Id').isInt()];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getCategories);
    this.router.get(`${this.path}/:id`, validate(this.idValidator), this.getCategory);
    this.router.post(this.path, validate(this.categorySchema), this.createCategory);
    this.router.put(this.path, validate(this.categorySchema), this.updateCategory);
    this.router.delete(`${this.path}/:id`, validate(this.idValidator), this.deleteCategory);
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
      const { title, color } = req.body;
      const newCategory = await Category.create({ title, color });
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
