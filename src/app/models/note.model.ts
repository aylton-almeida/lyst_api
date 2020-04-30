import sequelizeInstance from '../../database';
import { DataTypes, Model } from 'sequelize';
import { checkSchema, ValidationChain } from 'express-validator';
import Category from './category.model';

const config = {
  tableName: 'notes',
  sequelize: sequelizeInstance,
};

class Note extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public categoryId!: number;
  public userId!: number;

  //timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Note.init(
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
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  config,
);

export default Note;

export const noteSchema: ValidationChain[] = checkSchema({
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
  content: {
    in: ['body'],
    isString: true,
    errorMessage: 'Invalid content',
  },
});
