const express = require("express");
const router = express.Router();
const authenticatemiddleware = require("../middleware/auth");

const signupControl = require("../controllers/signupControl");

router.post("/user/signup", signupControl.signup);
router.post("/user/login", signupControl.login);
router.get("/user/download", authenticatemiddleware.authenticate, signupControl.reportGeneration);


module.exports = router;