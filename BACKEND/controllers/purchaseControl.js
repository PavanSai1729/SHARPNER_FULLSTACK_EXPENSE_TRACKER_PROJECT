const Razorpay = require("razorpay");
const Order = require("../models/orders");
const userController = require("./signupControl");
require('dotenv').config();

const purchasepremium = async (req, res)=> {
    try{

        
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        console.log("Razorpay Key ID:", key_id);
        console.log("Razorpay Key Secret:", key_secret);

        // var rzp = new Razorpay({
        //     key_id: process.env.RAZORPAY_KEY_ID,
        //     key_secret: process.env.RAZORPAY_KEY_SECRET
        // });

        if(!key_id || !key_secret){
            throw new Error("Razorpay key_id or key_secret is missing");
        }

        var rzp = new Razorpay({
            key_id: key_id,
            key_secret: key_secret
        });

        const amount= 2500;  

        rzp.orders.create({ amount, currency: "INR" }, async (err, order)=>{
            if(err){
                console.error("Error creating order with razorpay: ", err);
                return res.status(500).json({message: "failed to create order", error: err});
                //throw new Error(JSON.stringify(err));
            }

            try{
                await req.user.createOrder({ orderid: order.id, status: "PENDING"});
                return res.status(201).json({order, key_id: rzp.key_id});
                
            }
            catch(error){
                    //throw new Error(error);
                    console.log("Error saving order to database: ", error);
                    return res.status(201).json({ message: "failed to save order to database", error: error.message });
                }
        });
    }
    catch(error){
        console.log("Error in purchasepremium: ", error);
        res.status(403).json({message: "something went wrong", error: error.message});
    }
}


const updateTransactionStatus = async(req, res)=>{
    try{

        const userId = req.user.id;
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({where: {orderid: order_id}});
        const promise1 = order.update({paymentid: payment_id, status: "SUCCESSFUL"});
        const promise2 = req.user.update({ispremiumuser: true});

        Promise.all([promise1, promise2])
            .then((response)=>{
                return res.status(202).json({message: "Transaction successfull", token: userController.generateAccessToken(userId, undefined, true )});
            })
            .catch((error)=>{
                throw new Error(error);
            })

    }
    catch(error){
        console.log(error);
        res.status(403).json({error: error, message: "something went wrong"});
    }
}


module.exports = {
    purchasepremium,
    updateTransactionStatus
};