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
    start: {
      type: Sequelize.BIGINT
    },
    finish: {
      type: Sequelize.BIGINT
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
