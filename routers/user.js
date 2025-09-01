const express = require("express")
const router = express.Router()
const { 
    updateStatusSeller,
    deleteUser,
    listUserSeller,
    listUserBuyer,
    getUserProfile,
    updateUser,
    updateimage,
    getSellerProfile,
    updateSeller,
    getpostBySeller,
    userdeposit,
    getdeposits,
    useruploadDocument,
    searchFiltersSeller
} = require("../controllers/user")
const upload = require("../Middlewares/upload")
const uploadDocument = require("../Middlewares/document")
const {isAuthenticated} = require("../Middlewares/authCheck")

//Seller
router.put("/user/:id", updateStatusSeller)
router.post("/user/:id", deleteUser)
router.get("/userSeller", listUserSeller)
router.get("/search/post/seller",isAuthenticated,searchFiltersSeller)

//ยังไม่ใช้ตอนนี้
router.get("/profileseller/:id",getSellerProfile)

router.patch("/profileseller",isAuthenticated,updateSeller)
router.get("/post/seller",isAuthenticated,getpostBySeller)

//Buyer
router.get("/userBuyer", listUserBuyer)
router.get("/profile/:id", getUserProfile)
router.patch("/profile",isAuthenticated,updateUser)

//Deposit User
router.post("/deposit/:userId",userdeposit)
router.get("/deposit",getdeposits)

//profile image
router.post("/image",isAuthenticated,upload.single("image"),updateimage)
//upload document
router.post("/document",uploadDocument.single("document"),useruploadDocument)
module.exports = router

