

const Expense = require("../models/expenseModel");
const User = require("../models/signupModel");
const sequelize = require("../util/database");

exports.postRequest = async(req, res, next) => {
    const t = await sequelize.transaction();

    try{
    
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


// exports.getRequest = async(req, res, next) => {
//     try{
//         const expenses = await Expense.findAll({where: {UserId: req.user.id}});
//         res.status(200).json({allExpenses: expenses});
//     }
//     catch(error){
//         console.log("get request failed from backend", JSON.stringify(error));
//         res.status(500).json({error: error});
//     }
// };

// const ITEMS_PER_PAGE =2;

// exports.getRequest = async(req, res, next)=>{
//     const page = +req.query.page || 1;
//     let totalItems;

//     Expense.findAll({
//                 offset: page -1 * ITEMS_PER_PAGE,
//                 limit: ITEMS_PER_PAGE,
//             })
//         .then((expenses)=>{
//             res.json({
//                 expenses: expenses,
//                 currentPage: page,
//                 hasNextPage: ITEMS_PER_PAGE * page < totalItems,
//                 nextPage: page+1,
//                 hasPreviousPage: page>1,
//                 previousPage: page-1,
//                 lastPage: Math.ceil(totalItems/ITEMS_PER_PAGE),
                
//             })
//         })
//         .catch((error)=>{
//             console.log("getting expenses failed: ",error);
//         })
// }




exports.getRequest = async (req, res, next) => {
    const ITEMS_PER_PAGE=5;
    const page=+ req.query.page || 1;
    let totalExp;
    //console.log("req====>",req.user.id)

    const {count,rows}=await Expense.findAndCountAll({ where : { UserId: req.user.id},
        offset: (page-1)*ITEMS_PER_PAGE,
      //  limit: ITEMS_PER_PAGE
        limit: 5
    })

    console.log("count======>",count)
    console.log("expenses======>",rows)
    totalExp=count;
    res.status(200).json({allExpenses:rows, currentPage:page, hasNextPage: ITEMS_PER_PAGE*page<totalExp, nextPage:page+1, hasPreviousPage: page>1, previousPage: page-1, lastPage: Math.ceil(totalExp/ITEMS_PER_PAGE)})

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