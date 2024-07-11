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
    email : Sequelize.STRING,
    password: Sequelize.STRING
});

module.exports = User;