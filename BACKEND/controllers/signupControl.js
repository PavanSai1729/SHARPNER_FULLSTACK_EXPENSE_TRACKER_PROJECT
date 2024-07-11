const User = require("../models/signupModel");

exports.postRequest = async(req, res, next) => {
    try{

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const existingUser = await User.findOne({where: {email}});

        if(existingUser){
            return res.status(403).json({message: "user already exists"});
        }

        const data = await User.create({name: name, email: email, password: password});
        res.status(201).json({message: "user registered successfully"});


    }
    catch(error){
        console.log("post request in database failed", error);
        res.status(500).json({error: error});
    }
}