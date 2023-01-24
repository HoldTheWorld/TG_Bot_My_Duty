const {
  Model,
} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(Duty, {
        foreignKey: 'user_id'
      })
    }
  }
  User.init({
    user_tg_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
