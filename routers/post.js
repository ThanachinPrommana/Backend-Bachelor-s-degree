const express = require("express")
const router = express.Router()

const propertyUpload = require("../Middlewares/propertyUploader")

const {
    createpost,
    getbycategory,
    getPost,
    removepost,
    updatePost,
    searchFilters,
    getallcategory
}
    = require("../controllers/post")
const { isAuthenticated } = require("../Middlewares/authCheck")

router.post("/propertypost", isAuthenticated, propertyUpload.fields([
    { name: "images", maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), createpost)

router.get("/post/category/:categoryId", getbycategory)
router.get("/propertypost/:id", getPost)
router.get("/allcategory",getallcategory)

router.delete("/propertypost/:id", removepost)
router.patch("/propertypost/:id", propertyUpload.fields([
    { name: "images", maxCount: 5 },
    { name: 'videos', maxCount: 2 }
]), updatePost)
router.post("/search/filters", searchFilters)
module.exports = router