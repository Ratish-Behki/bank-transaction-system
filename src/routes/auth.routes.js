const express = require("express")
const userAuthController = require("../controllers/auth.controller")


const router = express.Router()

router.post("/register", userAuthController.userRegisterController)
router.post("/login",userAuthController.userloginController)
router.post("/logout", userAuthController.userLogoutController)

module.exports = router