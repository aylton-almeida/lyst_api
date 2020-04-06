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
  public color!: number;
  public userId!: number;

  // Declare methods example
  // verifyPassword: (password: string) => boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      type: DataTypes.DOUBLE,
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
    isFloat: true,
    errorMessage: 'Invalid color',
  },
});
