'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('users', ['email'], {
      unique: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeIndex('users', ['email'], { unique: true });
  },
};
