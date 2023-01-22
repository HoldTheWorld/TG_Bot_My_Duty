'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Timings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    duty_id: {
      type: Sequelize.STRING,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Duties',
        key: 'id'
      }
    },
    start_date: {
      type: Sequelize.DATEONLY
    },
    finish_date: {
      type: Sequelize.DATEONLY
    },
    start_time: {
      type: Sequelize.TIME
    },
    finish_time: {
      type: Sequelize.TIME
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Timings');
}
