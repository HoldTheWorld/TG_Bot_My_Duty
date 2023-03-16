require("babel-register");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_tg_id: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    time_zone: {
      type: Sequelize.INTEGER,
      defaultValue: 10800,
      allowNull: false
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
  await queryInterface.dropTable('Users')
},
}
