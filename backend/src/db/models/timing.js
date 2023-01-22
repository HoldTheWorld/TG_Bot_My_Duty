'use strict';
import { Model, STRING } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Timing extends Model {
    static associate(models) {
      this.belongsTo(Duty, {
        foreignKey: 'id'
      })
    }
  }
  Timing.init({
    duty_id: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    finish_date: DataTypes.DATEONLY,
    start_time: DataTypes.TIME,
    finish_time: DataTypes.TIME

  }, {
    sequelize,
    modelName: 'Timing',
  });
  return Timing;
};
