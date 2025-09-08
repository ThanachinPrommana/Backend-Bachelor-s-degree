const express = require("express")
const router = express.Router()
const {
    getuserNotifications,
    removeNotification,
    removeNotiAll
} = require("../controllers/notification")
const { isAuthenticated } = require("../Middlewares/authCheck")

router.get("/user/notification/:userId", getuserNotifications)
router.delete("/user/remove/noti/:notiId", isAuthenticated, removeNotification)
router.delete("/user/removeAll/noti",removeNotiAll)
module.exports = router