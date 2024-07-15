const User = require("../models/signupModel");
const Expense = require("../models/expenseModel");
const sequelize = require("../util/database");
const e = require("express");

const getUserLeaderBoard = async (req, res) => {
    try{

        const leaderboardofusers = await User.findAll({
            attributes: ["id", "name", [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"]],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ["users.id"],
            order: [["total_cost", "DESC"]]
        })


        res.status(200).json(leaderboardofusers);

    }
    catch(error){
        
        console.log("error from BACKEND LEADERBOARD: ", error);
        res.status(500).json(error);
    }
}

module.exports = {
    getUserLeaderBoard
}