const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ForgotPassword = sequelize.define("password", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        
    },

    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE 
});

module.exports = ForgotPassword;