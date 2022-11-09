const Sequelize = require("sequelize");

module.exports = class Log extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        intro: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        period: {
          type: Sequelize.STRING(23),
          allowNull: false,
        },
        learning: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        contribution: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        overcame: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        etc: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        underscored: false,
        modelName: "Log",
        tableName: "logs",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Log.belongsTo(db.Record);
  }
};
