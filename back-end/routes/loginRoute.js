const express = require("express");
const router = express.Router();
const { createAccessCode, validateAccessCode } = require("../controllers/loginController");

router.post("/createAccessCode", createAccessCode);
router.post("/validateAccessCode", validateAccessCode);

module.exports = router;
