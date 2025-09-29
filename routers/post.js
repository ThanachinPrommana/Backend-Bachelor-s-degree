import express from "express";
import propertyUpload from "../Middlewares/propertyUploader.js";
import { 
    createpost, 
    getbycategory, 
    getPost, 
    removepost, 
    updatePost, 
    searchFilters, 
    getallcategory,
    getHomePagePosts
} from "../controllers/post.js";
import { isAuthenticated } from "../Middlewares/authCheck.js";

const router = express.Router();

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
router.get("/homepage/posts", getHomePagePosts);
export default router;