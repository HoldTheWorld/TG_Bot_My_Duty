const {
  Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Duty extends Model {
    static associate({User}) {
      this.belongsTo(User, {
        foreignKey: 'id'
      })
    }
  }
  Duty.init({
    user_id: DataTypes.STRING,
    duty_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Duty',
  });
  return Duty;
};
