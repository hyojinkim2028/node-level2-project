const Sequelize = require('sequelize');

class Goods extends Sequelize.Model {
  static initiate(sequelize) {
    Goods.init(
      {
        goods: Sequelize.STRING,
        content: Sequelize.STRING,
        status: Sequelize.ENUM('for-sale', 'sold-out'),
      },
      {
        sequelize,
        timestamps: true, // createdAt,updatedAt
        underscored: false,
        modelName: 'Goods',
        tableName: 'Goods',
        paranoid: true, // deletedAt
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.Goods.belongsTo(db.User); // n : 1
  }
}

module.exports = Goods;
