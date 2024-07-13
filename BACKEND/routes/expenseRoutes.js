const express = require("express");
const router = express.Router();
const userAuthentication = require("../middleware/auth");

const expenseController = require("../controllers/expenseControl");

router.post("/expense/add-expense", userAuthentication.authenticate, expenseController.postRequest);

router.get("/expense/get-expenses", userAuthentication.authenticate, expenseController.getRequest);

router.delete("/expense/delete-expense/:id", userAuthentication.authenticate, expenseController.deleteRequest);

module.exports = router;