const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const categoryController = require("../controllers/categoryController");

router
  .route("/")
  .get(wrapAsync(categoryController.getAllCategories))
  .post(wrapAsync(categoryController.createCategory));

router
  .route("/:id")
  .get(wrapAsync(categoryController.getCategoryById))
  .put(wrapAsync(categoryController.updateCategory))
  .delete(wrapAsync(categoryController.deleteCategory));

module.exports = router;