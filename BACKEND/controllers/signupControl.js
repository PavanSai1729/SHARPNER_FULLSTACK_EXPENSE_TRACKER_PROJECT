const User = require("../models/signupModel");
const Expense = require("../models/expenseModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');


function isstringinvalid(string){
    if(string == undefined || string.length == 0){
        return true;
    }
    else{
        return false;
    }
}

exports.signup = async(req, res, next) => {
    try{

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({error: "Bad parameters something is missing"});
        }

        const saltrounds =10;
        const hashedPassword = await bcrypt.hash(password, saltrounds);

        await User.create({name, email, password: hashedPassword});
        res.status(201).json({message: "user registered successfully"});

    
    }
    catch(error){
        console.log("post request in database failed", error);
        res.status(500).json({error: error});
    }
}


function generateAccessToken(id, name, ispremiumuser){
    return jwt.sign({UserId : id, name: name, ispremiumuser }, "pavansaiburada7702705695");
}

exports.generateAccessToken = generateAccessToken;

exports.login = async(req, res, next) => {
    try{

        const email = req.body.email;
        const password = req.body.password;

        if(isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({message: "Email or Password is missing"})
        }

        const user = await User.findAll({where: {email}});
            if(user.length>0){
                bcrypt.compare(password, user[0].password, (err, result)=>{
                    if(err){
                        
                        return res.status(500).json({success: false, message: "something went wrong"});
                    }

                    if(result === true){
                        console.log("----user id:----", user[0].id);
                       return res.status(200).json({success: true, message: "user logged in successfully", token: generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser)});
                    }

                    else{
                        return res.status(400).json({success: false, message: "password is incorrect"});
                    }
                })
            }
            else{
                return res.status(404).json({success: false, message: "user does not exist"});
            }
        }
        catch(error){
            //console.log("error during login ", error);
            res.status(500).json({message: error, success: false});
    }
}



exports.reportGeneration = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user expenses
        const expenses = await Expense.findAll({ where: { userId } });

        if (expenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found for the user.' });
        }

        // Define CSV file path
        const downloadsDir = path.join(__dirname, '..', 'downloads');
        const filePath = path.join(downloadsDir, `expenses_${userId}.csv`);

        // Ensure the downloads directory exists
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir);
        }

        // Define CSV writer
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'id', title: 'ID' },
                { id: 'amount', title: 'Amount' },
                { id: 'description', title: 'Description' },
                { id: 'category', title: 'Category' }
            ]
        });

        // Write expenses to CSV
        await csvWriter.writeRecords(expenses.map(expense => expense.dataValues));

        // Send file URL for download
        
        res.status(201).json({ fileUrl: `http://localhost:1000/downloads/expenses_${userId}.csv` });
    } catch (error) {
        console.log("Getting report from database failed: ", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


