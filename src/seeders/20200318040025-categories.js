'use strict';

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'categories',
      [
        {
          title: 'Category 1',
          color: 'ffffff',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Category 2',
          color: '000000',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('categories', null, {});
  },
};
