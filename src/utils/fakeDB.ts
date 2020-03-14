// To be substituted by Sequelize model
import Category from "../models/category.model";

export const fakeDB: Category[] = [new Category({ id: 1, title: 'category 1', color: 'ffffff' })];
