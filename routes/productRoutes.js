const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router
  .route("/")
  .get(authMiddleware,wrapAsync(productController.getAllProducts))
  .post(authMiddleware,adminMiddleware,wrapAsync(productController.createProduct));

router
  .route("/:id")
  .get(authMiddleware,wrapAsync(productController.getProductById))
  .put(authMiddleware,adminMiddleware,wrapAsync(productController.updateProduct))
  .delete(authMiddleware,wrapAsync(productController.deleteProduct));

module.exports = router;