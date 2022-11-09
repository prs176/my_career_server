const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const User = require("./user");
const Record = require("./record");
const Log = require("./log");

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.Record = Record;
db.Log = Log;

User.init(sequelize);
Record.init(sequelize);
Log.init(sequelize);

User.associate(db);
Record.associate(db);
Log.associate(db);

module.exports = db;
