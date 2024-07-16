const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const Expense = require("./models/expenseModel");
const User = require("./models/signupModel");
const Order = require("./models/orders");
const Password = require("./models/passwordModel");

const db = require("./util/database");
const signupRoutes = require("./routes/signupRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));



app.use(signupRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumFeatureRoutes);
app.use(passwordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Password);
Password.belongsTo(User);

db 
    .sync()
    .then((response)=>{
        console.log("successfully database is connected.");
        app.listen(1000);
    })
    .catch((error)=>{
        console.log("database Connection failed.", error);
    });