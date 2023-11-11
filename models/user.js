'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      userId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: DataTypes.STRING,
      nickname: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: true, // createdAt,updatedAt
      underscored: false,
      modelName: 'User',
      tableName: 'Users',
      paranoid: true, // deletedAt
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    }
  );
  return User;
};
