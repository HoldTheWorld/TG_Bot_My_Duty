require("babel-register");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Timings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    duty_id: {
      type: Sequelize.INTEGER,
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
},
down: async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('Timings')
},
}
