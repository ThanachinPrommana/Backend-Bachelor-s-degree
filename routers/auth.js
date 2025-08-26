const express = require("express")
const router = express.Router()
const {
    preRegister,
    login,
    forgotPassword,
    resetPassword,
    verifyandregister,
    getProfile,
    logout
} = require("../controllers/auth")
const {isAuthenticated} = require("../Middlewares/authCheck")

router.post("/preRegister", preRegister)
router.post("/verifyandregister", verifyandregister)
router.post("/login", login)

router.post("/forgotpassword", forgotPassword)
router.post("/resetpassword", resetPassword)

router.get("/profiles/user",isAuthenticated,getProfile)
router.post("/logout",logout)

module.exports = router