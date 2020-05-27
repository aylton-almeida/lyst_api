import sequelizeInstance from '..';
import { Association, DataTypes, Model } from 'sequelize';
import { checkSchema, ValidationChain } from 'express-validator';
import bcrypt from 'bcryptjs';
import Category from './category.model';
import Note from './note.model';

const config = {
  tableName: 'users',
  sequelize: sequelizeInstance,
  defaultScope: {
    attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpire'] },
  },
  scopes: {
    includePassword: {
      attributes: { include: ['password'], exclude: ['passwordResetToken', 'passwordResetExpire'] },
    },
    includePasswordResets: {
      attributes: { include: ['passwordResetToken', 'passwordResetExpire'], exclude: ['password'] },
    },
  },
};

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public passwordResetToken!: string;
  public passwordResetExpire!: Date;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    categories: Association<User, Category>;
    notes: Association<User, Note>;
  };
}

User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  config,
);

User.beforeBulkCreate(async users => {
  for (const user of users) user.password = await bcrypt.hash(user.password, 10);
});

User.beforeSave(async user => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.afterCreate(user => {
  user.password = '';
});

export default User;

export const userSchema: ValidationChain[] = checkSchema({
  id: {
    in: ['params', 'query', 'body'],
    isInt: true,
    errorMessage: 'Invalid Id',
    optional: {
      options: { nullable: true },
    },
  },
  email: {
    in: ['body'],
    isString: true,
    isEmail: true,
    errorMessage: 'Invalid Email',
  },
  password: {
    in: ['body'],
    isString: true,
    errorMessage: 'Invalid password',
    isLength: {
      errorMessage: 'Password must be at least 8 characters long',
      options: { min: 8 },
    },
  },
});

export const resetPassSchema = checkSchema({
  email: {
    in: ['body'],
    isString: true,
    isEmail: true,
    errorMessage: 'Invalid Email',
  },
  token: {
    in: ['body'],
    isString: true,
    errorMessage: 'Invalid Token',
  },
  password: {
    in: ['body'],
    isString: true,
    errorMessage: 'Invalid password',
    isLength: {
      errorMessage: 'Password must be at least 8 characters long',
      options: { min: 8 },
    },
  },
});
