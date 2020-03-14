import { checkSchema, ValidationChain } from 'express-validator';

export default class Category {
  id?: number;
  title: string;
  color: string;

  constructor(category: any) {
    this.id = Number(category.id);
    this.title = category.title;
    this.color = category.color;
  }

  static schema: ValidationChain[] = checkSchema({
    id: {
      in: ['params', 'query', 'body'],
      isInt: true,
      optional: true,
      errorMessage: 'Invalid Id',
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
        errorMessage: 'Color must be 3 or 6 chars long',
        options: { min: 3, max: 6 },
      },
    },
  });
}
