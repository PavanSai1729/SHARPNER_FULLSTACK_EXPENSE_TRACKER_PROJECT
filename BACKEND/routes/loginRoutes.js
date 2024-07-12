//const express = require("express");
//const router = express.Router();

//const loginControl = require("../controllers/loginControl");

router.post("/user/login", loginControl.postRequest);

module.exports = router;