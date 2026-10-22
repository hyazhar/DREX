const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


router
  .route("/")
  .get(wrapAsync(categoryController.getAllCategories))
  .post(authMiddleware,adminMiddleware,wrapAsync(categoryController.createCategory));

router
  .route("/:id")
  .get(wrapAsync(categoryController.getCategoryById))
  .put(authMiddleware,adminMiddleware,wrapAsync(categoryController.updateCategory))
  .delete(authMiddleware,adminMiddleware,wrapAsync(categoryController.deleteCategory));

module.exports = router;