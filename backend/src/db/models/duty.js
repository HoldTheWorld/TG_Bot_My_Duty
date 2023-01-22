'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Duty extends Model {
    static associate(models) {
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
