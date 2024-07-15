
const Expense = require("../models/expenseModel");
const User = require("../models/signupModel");

exports.postRequest = async(req, res, next) => {
    const t = await sequelize.transaction();

    try{

        // const amount = req.body.amount;
        // const description = req.body.description;
        // const category = req.body.category;
        // const UserId = req.user.id;
        
        
        const {amount, description, category} = req.body;

        if(amount === undefined || amount.length ===0 ){
            return res.status(400).json({success: false, message: "parameters missing"});
        }

        const data = await Expense.create({amount, description, category, UserId: req.user.id }, {transaction: t});
        const totalExpense = Number(req.user.totalExpenses) + Number(amount);
        console.log(totalExpense);

        await User.update({
            totalExpenses: totalExpense
        },{
            where: {id: req.user.id},
            transaction : t
       });

        await t.commit();
        res.status(201).json({newExpenseDetails: data});

    }
    catch(error){
        await t.rollback();
        console.log(error);
        console.log("post request failed from backend", JSON.stringify(error));
        res.status(500).json({error: error});
    }
};


exports.getRequest = async(req, res, next) => {
    try{
        const expenses = await Expense.findAll({where: {UserId: req.user.id}});
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