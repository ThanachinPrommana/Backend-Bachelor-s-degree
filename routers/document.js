const express = require("express")
const router = express("Router")
const {approveDocument} = require("../controllers/document")
const {isAuthenticated} = require("../Middlewares/authCheck")

router.patch("/update/document/:documentId",isAuthenticated,approveDocument)

module.exports = router
