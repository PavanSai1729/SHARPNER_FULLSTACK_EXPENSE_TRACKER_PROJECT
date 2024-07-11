const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./util/database");
const signupRoutes = require("./routes/signupRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.use(signupRoutes);

db 
    .sync()
    .then((response)=>{
        console.log("successfully database is connected.");
        app.listen(1000);
    })
    .catch((error)=>{
        console.log("database Connection failed.", error);
    });