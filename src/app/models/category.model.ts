import sequelizeInstance from './index';
import { Model, DataTypes, Association } from 'sequelize';
import { checkSchema, ValidationChain } from 'express-validator';
import User from './user.model';

const config = {
  tableName: 'categories',
  sequelize: sequelizeInstance,
};

class Category extends Model<Category> {
  public id!: number;
  public title!: string;
  public color!: string;
  public userId!: number;

  // Declare methods example
  // verifyPassword: (password: string) => boolean;

  // timestamps
  public readonly createdDate!: Date;
  public readonly updatedOn!: Date;
}

Category.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  config
);

export default Category;

export const categorySchema: ValidationChain[] = checkSchema({
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
