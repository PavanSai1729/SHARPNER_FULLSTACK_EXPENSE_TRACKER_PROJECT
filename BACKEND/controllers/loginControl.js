//const User = require("../models/signupModel");

exports.postRequest = async(req, res, next) => {
    try{

        const email = req.body.email;
        const password = req.body.password;

        const existingUser = await User.findOne({where: {email}});

        if(!existingUser){
            return res.status(404).json({message: "user not found please signup"});
        }

        if(existingUser.password != password){
            return res.status(401).json({message: "invalid password"});
        }

        res.status(200).json({message: "login successfully"});


    }
    catch(error){
        console.log("error during login ", error);
        res.status(500).json({error: error});
    }
}