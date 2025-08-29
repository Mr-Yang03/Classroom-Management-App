const express = require("express");
const router = express.Router();
const { checkInstructorPhone, validateAccessCode } = require("../controllers/loginController");

router.post("/check-phone", checkInstructorPhone);
router.post("/validate-code", validateAccessCode);

module.exports = router;
