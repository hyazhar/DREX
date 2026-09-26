const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");
const wrapAsync = require("../utils/wrapAsync");

// Get cart
router.get("/", authMiddleware, wrapAsync(cartController.getCart));

// Add product
router.post("/", authMiddleware, wrapAsync(cartController.addToCart));

// Update quantity
router.put("/:productId",authMiddleware,wrapAsync(cartController.updateCartItem));

// Remove product
router.delete(
  "/:productId",
  authMiddleware,
  wrapAsync(cartController.removeFromCart),
);

// Clear cart
router.delete("/", authMiddleware, wrapAsync(cartController.clearCart));

module.exports = router;
