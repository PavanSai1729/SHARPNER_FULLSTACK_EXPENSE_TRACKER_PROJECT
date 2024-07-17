// services/UserServices.js

const User = require("../models/signupModel"); // Adjust path as per your file structure
const Expense = require("../models/expenseModel"); // Adjust path as per your file structure

// Function to fetch expenses for a user
async function getExpenses(req) {
    try {
        // Example logic to fetch expenses for the authenticated user
        const userId = req.user.id; // Assuming req.user contains user information
        const expenses = await Expense.findAll({ where: { UserId: userId } }); // Example Sequelize query
        return expenses;
    } catch (error) {
        console.error("Error fetching expenses:", error);
        throw new Error("Failed to fetch expenses");
    }
}

module.exports = getExpenses;
