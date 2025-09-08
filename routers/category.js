const express = require("express");
const router = express.Router();
const {
  create,
  removecategory,
  list,
  getById,             
} = require("../controllers/category");

router.post("/category", create);
router.delete("/category/:id", removecategory);
router.get("/category", list);
router.get("/category/:id", getById);  

module.exports = router;
