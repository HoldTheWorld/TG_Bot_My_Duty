const {
  Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Timing extends Model {
    static associate({Duty}) {
      this.belongsTo(Duty, {
        foreignKey: 'id'
      })
    }
  }
  Timing.init({
    duty_id: DataTypes.STRING,
    start: DataTypes.BIGINT,
    finish: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Timing',
  });
  return Timing;
};
