const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

//router.post("/signin", authController.postSignin);
router.get("api/login", authController.postLogin);
//router.get("/admin/", authController.getUser);

module.exports = router;

