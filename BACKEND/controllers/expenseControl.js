
const Expense = require("../models/expenseModel");

exports.postRequest = async(req, res, next) => {
    try{

        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const data = await Expense.create({amount: amount, description: description, category: category});
        res.status(201).json({newExpenseDetails: data});

    }
    catch(error){
        console.log("post request failed from backend", JSON.stringify(error));
        res.status(500).json({error: error});
    }
};


exports.getRequest = async(req, res, next) => {
    try{
        const expenses = await Expense.findAll();
        res.status(200).json({allExpenses: expenses});
    }
    catch(error){
        console.log("get request failed from backend", JSON.stringify(error));
        res.status(500).json({error: error});
    }
};


exports.deleteRequest = async(req, res, next) => {
    try{

        const eId = req.params.id;
        await Expense.destroy({where: {id: eId}});
        res.sendStatus(200);

    }
    catch(error){
        console.log("delete request failed from backend", JSON.stringify(error));
        res.status(500).json({error: error}); 
    }
};