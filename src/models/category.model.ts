import sequelizeInstance from './';
import { Model, DataTypes } from 'sequelize';

const config = {
  tableName: 'categories',
  sequelize: sequelizeInstance,
};

class Category extends Model<Category> {
  public id!: number;
  public title!: string;
  public color!: string;

  // Declare methods example
  // verifyPassword: (password: string) => boolean;

  // timestamps
  public readonly createdDate!: Date;
  public readonly updatedOn!: Date;

  public static associations: {
    // Add associations here
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
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  config
);

export default Category;
