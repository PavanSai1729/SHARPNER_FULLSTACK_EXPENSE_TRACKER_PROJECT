const User = require("../models/signupModel");
const bcrypt = require("bcrypt");

exports.signup = async(req, res, next) => {
    try{

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if(!name || !password || !email){
            return res.status(400).json({error: "one of the name, password, email value is missing"});
        }

        const existingUser = await User.findOne({where: {email}});

        if(existingUser){
            return res.status(403).json({message: "user already exists"});
        }

        const saltrounds =10;
        bcrypt.hash(password, saltrounds, async(err, hash)=>{
            console.log(err);
            await User.create({name, email, password: hash});
            res.status(201).json({message: "user registered successfully"});

        })
    }
    catch(error){
        console.log("post request in database failed", error);
        res.status(500).json({error: error});
    }
}



exports.login = async(req, res, next) => {
    try{

        const email = req.body.email;
        const password = req.body.password;

        const existingUser = await User.findOne({where: {email}});
       

        if(!existingUser){
            return res.status(404).json({message: "user not found please signup"});
        }

        bcrypt.compare(password, existingUser.password, (err, result)=>{
            if(err){
                res.status(500).json({success: false, message: "something went wrong"});
            }

            if(result){
                //res.status(200).json({success: true, message: "user logged in successfully"});
                //return res.redirect("D:\Java_Script\Sharpner\Node.js\sharpner_projects\Full_Stack_Expense_Tracker_Final_Project\FRONTEND\expense\expense.html");
                return res.json({
                    success: true,
                    message: "User logged in successfully",
                    redirectUrl: "..\FRONTEND\expense\expense.html"
                });
            }

            else{
                return res.status(401).json({message: "invalid password"});
            }
        });

        // if(existingUser.password != password){
        //     return res.status(401).json({message: "invalid password"});
        // }

        // res.status(200).json({message: "login successfully"});


    }
    catch(error){
        console.log("error during login ", error);
        res.status(500).json({error: error});
    }
}