import sequelizeInstance from '..';
import { Model, DataTypes, Association } from 'sequelize';
import { checkSchema, ValidationChain } from 'express-validator';
import Note from './note.model';

const config = {
  tableName: 'categories',
  sequelize: sequelizeInstance,
};

class Category extends Model {
  public id!: number;
  public title!: string;
  public color!: number;
  public userId!: number;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    notes: Association<Category, Note>;
  };
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
  config,
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
