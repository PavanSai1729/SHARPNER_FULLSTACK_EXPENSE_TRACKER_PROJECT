const express = require("express");
const router = express.Router();

const signupControl = require("../controllers/signupControl");

router.post("/user/signup", signupControl.signup);
router.post("/user/login", signupControl.login);


module.exports = router;