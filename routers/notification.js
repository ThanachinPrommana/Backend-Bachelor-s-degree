const express = require("express")
const router = express.Router()
const {
    getuserNotifications
} = require("../controllers/notification")

router.get("/user/notification/:userId",getuserNotifications)

module.exports = router