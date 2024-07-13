const jwt = require("jsonwebtoken");
const User = require("../models/signupModel");



const authenticate = async(req, res, next) =>{
    try{
        const token = req.header("Authorization");
        //console.log("----TOKEN:-----", token);

        if(!token){
            return res.status(401).json({success: false, message: "Token is missing"});
        }

        const decoded = jwt.verify(token, "pavansaiburada7702705695");
        if(!decoded){
            return res.status(401).json({success: false, message: "Token invalid"});
        }

        const user = await User.findByPk(decoded.UserId);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
      
        
    }
    catch(error){
        console.log(error);
        return res.status(401).json({success: false});
    }
}


// const authenticate = (req, res, next) =>{
//     try{
//         const token = req.header("Authorization");
//         //console.log("----TOKEN:-----", token);
//         const user = jwt.verify(token, "pavansaiburada7702705695");
//         console.log("--------USER: ",user);
//         User.findByPk(user.UserId)
//             .then((user)=>{
//                 //console.log("---------USERR-:",JSON.stringify(user));
//                 //console.log("-------request:", req.user);
//                 req.user = user;
//                 next();
//             })
            
//     }
//     catch(error){
//         console.log(error);
//         return res.status(401).json({success: false});
//     }
// }

module.exports = {
    authenticate 
};