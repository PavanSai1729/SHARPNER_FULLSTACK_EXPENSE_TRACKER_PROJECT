const Sequelize = require("sequelize");
const db = require("../util/database");

const Expense = db.define("expenses", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        primaryKey: true,
        allowNull: false
    },

    amount: {
        type : Sequelize.STRING,
    },

    description: {
        type: Sequelize.STRING 
    },

    category: {
        type: Sequelize.STRING 
    }
});

module.exports = Expense;