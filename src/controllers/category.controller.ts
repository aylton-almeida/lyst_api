import * as express from 'express';
import Category from '../models/category.model';
import { param } from 'express-validator';
import { validate } from '../utils/validation.utils';
import { fakeDB } from '../utils/fakeDB';

class CategoryController {
  public path = '/category';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getCategories);
    this.router.get(
      `${this.path}/:id`,
      validate([param('id', 'invalid Id').isInt()]),
      this.getCategory
    );
    this.router.post(this.path, validate(Category.schema), this.createCategory);
    this.router.delete(
      `${this.path}/:id`,
      validate([param('id', 'invalid Id').isInt()]),
      this.deleteCategory
    );
    this.router.put(this.path, validate(Category.schema), this.updateCategory);
  }

  getCategories = (request: express.Request, response: express.Response) => response.send(fakeDB);

  getCategory = (request: express.Request, response: express.Response) => {
    const id = request.params.id;
    const category = fakeDB.find(qry => qry.id === Number(id));
    if (category != null) response.send(category);
    else response.status(404).send({ error: 'Category not found' });
  };

  createCategory = (request: express.Request, response: express.Response) => {
    const category: Category = request.body;
    const lastCategory = fakeDB[fakeDB.length - 1];
    if (lastCategory == null) category.id = 1;
    else {
      // @ts-ignore
      category.id = lastCategory.id + 1;
    }
    fakeDB.push(new Category(category));
    response.send(fakeDB[fakeDB.length - 1]);
  };

  updateCategory = (request: express.Request, response: express.Response) => {
    const category: Category = request.body;
    const oldCategory = fakeDB.find(qry => qry.id === Number(category.id));
    if (oldCategory != null) {
      oldCategory.title = category.title;
      oldCategory.color = category.color;
      response.send('Category updated');
    } else response.status(404).send({ error: 'Category not found' });
  };

  deleteCategory = (request: express.Request, response: express.Response) => {
    const id = request.params.id;
    const categoryId = fakeDB.findIndex(qry => qry.id === Number(id));
    if (categoryId !== -1) {
      fakeDB.splice(categoryId, 1);
      response.send('Category deleted');
    } else response.status(404).send({ error: 'Category not found' });
  };
}

export default CategoryController;
