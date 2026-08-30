const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const productController = require("../controllers/productController");

router
  .route("/")
  .get(wrapAsync(productController.getAllProducts))
  .post(wrapAsync(productController.createProduct));

router
  .route("/:id")
  .get(wrapAsync(productController.getProductById))
  .put(wrapAsync(productController.updateProduct))
  .delete(wrapAsync(productController.deleteProduct));

module.exports = router;