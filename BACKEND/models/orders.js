const Sequelize = require("sequelize");
const sequelizedb = require("../util/database");

const Order = sequelizedb.define("order", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true 
    },
    paymentid: Sequelize.STRING,
    orderid: Sequelize.STRING,
    status: Sequelize.STRING
});

module.exports = Order;