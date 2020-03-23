import sequelizeInstance from './';
import { DataTypes, Model } from 'sequelize';
import { checkSchema, ValidationChain } from 'express-validator';
import bcrypt from 'bcryptjs';

const config = {
  tableName: 'users',
  sequelize: sequelizeInstance,
};

class User extends Model<User> {
  public id!: number;
  public email!: string;
  public password!: string;

  // timestamps
  public readonly createdDate!: Date;
  public readonly updatedOn!: Date;

  public static associations: {
    // Add associations here
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
  },
  config
);

User.beforeCreate(async user => {
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
