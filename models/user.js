const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        birth: {
          type: Sequelize.STRING(10), // yyyy-MM-dd
          allowNull: false,
        },
        intro: {
          type: Sequelize.STRING(100), // yyyy-MM-dd
          allowNull: false,
        },
      },
      {
        sequelize,
        underscored: false,
        modelName: "User",
        tableName: "users",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Record);
    db.User.belongsToMany(db.User, {
      foreignKey: "GoodMarkUserId",
      as: "GoodMarkedUsers",
      through: "Good",
    });
    db.User.belongsToMany(db.User, {
      foreignKey: "GoodMarkedUserId",
      as: "GoodMarkUsers",
      through: "Good",
    });
  }
};
