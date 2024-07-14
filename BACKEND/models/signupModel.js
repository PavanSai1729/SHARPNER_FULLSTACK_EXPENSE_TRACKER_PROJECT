const Sequelize = require("sequelize");
const db = require("../util/database");

const User = db.define("Users", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    },

    name: Sequelize.STRING,
    email : {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true 
    },

    password: Sequelize.STRING,
    ispremiumuser: Sequelize.BOOLEAN
});

module.exports = User;