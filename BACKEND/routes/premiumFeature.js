const express = require("express");

const authenticatemiddleware = require("../middleware/auth");
const premiumFeatureController = require("../controllers/premiumFeature");

const router = express.Router();

router.get("/premium/showLeaderBoard", authenticatemiddleware.authenticate, premiumFeatureController.getUserLeaderBoard);

module.exports = router;