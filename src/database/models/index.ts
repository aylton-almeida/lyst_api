import Category from './category.model';
import Note from './note.model';
import User from './user.model';

User.hasMany(Category, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'categories',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Category.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

User.hasMany(Note, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'notes',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Note.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

Category.hasMany(Note, {
  sourceKey: 'id',
  foreignKey: 'categoryId',
  as: 'notes',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Note.belongsTo(Category, { foreignKey: 'categoryId', targetKey: 'id' });

export default {
  user: User,
  category: Category,
  note: Note,
};
