const express = require("express")
const router = express.Router()

const upload = require("../Middlewares/upload");

const {
    createpost,
    getbycategory,
    getPost,
    removepost,
    updatePost,
    searchFilters
}
= require("../controllers/post")
const {isAuthenticated} = require("../Middlewares/authCheck")

router.post("/propertypost",isAuthenticated,upload.array("images",5),createpost)

router.get("/post/category/:categoryId",getbycategory)
router.get("/propertypost/:id",getPost)

router.delete("/propertypost/:id",removepost)
router.patch("/propertypost/:id",upload.array("images",5),updatePost)
router.post("/search/filters",searchFilters)
module.exports = router