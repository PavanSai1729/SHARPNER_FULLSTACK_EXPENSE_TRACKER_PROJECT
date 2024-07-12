const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenseControl");

router.post("/expense/add-expense", expenseController.postRequest);

router.get("/expense/get-expenses", expenseController.getRequest);

router.delete("/expense/delete-expense/:id", expenseController.deleteRequest);

module.exports = router;