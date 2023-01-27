'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        user_tg_id: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_tg_id: 'Lola',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      ], {});
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
