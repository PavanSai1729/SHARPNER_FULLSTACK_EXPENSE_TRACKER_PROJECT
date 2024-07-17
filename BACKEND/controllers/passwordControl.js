const uuid = require("uuid");
const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");
require("dotenv").config();
 
const User = require("../models/signupModel");
const ForgotPassword = require("../models/passwordModel");



const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (user) {
            // Generate a unique ID for password reset
            const id = uuid.v4();

            // Create a forgot password request in the database
            await ForgotPassword.create({ UserId: user.id, id, active: true });

            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications["api-key"];
            apiKey.apiKey = process.env.API_KEY;

            const tranEmailApi = new Sib.TransactionalEmailsApi();
            const sender = {
                 email: "pvnsai1729@gmail.com",
                 name: "Burada Pavan Sai"
            }

            const receivers = [
                {
                 email: email
            }
        ]

            // Send the email
            try {
                const status = await tranEmailApi.sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: "forgot password link",
                    htmlContent: `<a href="http://localhost:1000/password/resetpassword/${id}">Reset password</a>`
            
                })
            
                console.log(status);
            
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                return res.status(500).json({ message: 'Failed to send email', success: false });
            }
        } else {
            return res.status(404).json({ message: "User does not exist", success: false });
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
        return res.status(500).json({ message: error.message, success: false });
    }
};





const resetpassword = async (req, res) =>{
    const id = req.params.id;
    try{
        const forgotpasswordrequest = await ForgotPassword.findOne({ where: { id }});
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200).send(`<html>
                <script>
                function formsubmitted(e){
                e.preventDefault();
                console.log("called");
                }
                </script>
                <form action="/password/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New Password: </label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
                </form>
                </html>`);
            res.end();
        }


    }
    catch(error){
        console.log("reset password failed:", error);

    }
    
}



const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        ForgotPassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.UserId}}).then(user => {
            
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}