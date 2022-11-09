const Sequelize = require("sequelize");

module.exports = class Record extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        type: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        role: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        period: {
          type: Sequelize.STRING(23),
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        department: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        from: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        start: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        end: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        identifier: {
          type: Sequelize.STRING(50),
          allowNull: true,
        },
      },
      {
        sequelize,
        underscored: false,
        modelName: "Record",
        tableName: "records",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Record.hasMany(db.Log);
    db.Record.belongsTo(db.User);
  }
};
