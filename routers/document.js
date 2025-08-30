const express = require("express")
const router = express("Router")
const {
    approveDocument,
    getDocument,
    searchDocument
} = require("../controllers/document")
const { isAuthenticated } = require("../Middlewares/authCheck")

router.patch("/update/document/:documentId", isAuthenticated, approveDocument)
router.get("/list/document", isAuthenticated, getDocument)
router.get("/query/document", isAuthenticated,searchDocument)
module.exports = router
