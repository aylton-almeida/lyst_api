'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('users', 'passwordResetToken', {
        type: Sequelize.STRING,
        allowNull: true,
      })
      .then(() => {
        return queryInterface.addColumn('users', 'passwordResetExpire', {
          type: Sequelize.STRING,
          allowNull: true,
        });
      });
  },

  down: queryInterface => {
    return queryInterface
      .removeColumn('users', 'passwordResetToken')
      .then(() => queryInterface.removeColumn('users', 'passwordResetExpire'));
  },
};
