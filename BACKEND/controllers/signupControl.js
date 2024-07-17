const User = require("../models/signupModel");
const Expense = require("../models/expenseModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

//const getExpenses = require("../services/UserServices"); // Adjust this import based on your actual file structure
//const uplaodToS3 = require("../services/S3Service"); // Adjust this import based on your actual file structure
const express = require("express");
const router = express.Router();

const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const AWS=require('aws-sdk');
const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
require('dotenv').config();
const sequelize=require('../util/database');

router.use(bodyParser.json());

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


//report generation

function uploadToS3(data,filename){
    const BUCKET_NAME=process.env.BUCKET_NAME
    const IAM_USER_KEY=process.env.IAM_USER_KEY
    const IAM_SECRET_KEY=process.env.IAM_SECRET_KEY

    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_SECRET_KEY,
        Bucket:BUCKET_NAME
    })

    
        var params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read'
        }

        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log("Something went wrong",err);
                    reject(err);
                }
                else{
                    console.log("SUCCESS",s3response);
                    resolve(s3response.Location);
                }
            })
        })
        

}


exports.reportGeneration = async (req, res) => {
    try {
        const expenses=await req.user.getExpenses();
        //console.log("expenses=======>",expenses);
        const stringfiedExpenses=JSON.stringify(expenses);
        const userId=req.user.id;
        const filename=`Expense${userId}/${new Date()}.txt`;
        const fileURL=await uploadToS3(stringfiedExpenses,filename);
        res.status(200).json({fileURL, success:true})
    } catch (error) {
        console.error(error);
        res.status(500).json({ fileURL: "", success: false, error: error.message || "Something went wrong" });
    }
};