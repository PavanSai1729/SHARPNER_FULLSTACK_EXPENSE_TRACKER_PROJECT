const User = require("../models/signupModel");

exports.postRequest = async(req, res, next) => {
    try{

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const data = await User.create({name: name, email: email, password: password});
        res.status(201).json({newItem: data});

    }
    catch(error){
        console.log("post request in database failed", error);
        res.status(500).json({error: error});
    }
}