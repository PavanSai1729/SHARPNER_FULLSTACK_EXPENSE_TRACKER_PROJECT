const express = require("express");
const passwordController = require("../controllers/passwordControl");
const router = express.Router();

router.get("/password/updatepassword/:resetpasswordid", passwordController.updatepassword);

router.get("/password/resetpassword/:id", passwordController.resetpassword);

router.use("/password/forgotpassword", passwordController.forgotpassword);

module.exports = router;
