const express = require("express");
const router = express.Router();

const signupControl = require("../controllers/signupControl");

router.post("/user/signup", signupControl.postRequest);

module.exports = router;