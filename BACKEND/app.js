const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./util/database");
const signupRoutes = require("./routes/signupRoutes");
//const loginRoutes = require("./routes/loginRoutes");
const expenseRoutes = require("./routes/expenseRoutes");


const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.use(signupRoutes);
app.use(expenseRoutes);
//app.use(loginRoutes);

db 
    .sync()
    .then((response)=>{
        console.log("successfully database is connected.");
        app.listen(1000);
    })
    .catch((error)=>{
        console.log("database Connection failed.", error);
    });