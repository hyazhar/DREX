const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware");
const wrapAsync = require("../utils/wrapAsync");

// Get wishlist
router.get("/", authMiddleware, wrapAsync(wishlistController.getWishlist));

// Add product
router.post(
  "/:productId",
  authMiddleware,
  wrapAsync(wishlistController.addToWishlist),
);

// Remove product
router.delete(
  "/:productId",
  authMiddleware,
  wrapAsync(wishlistController.removeFromWishlist),
);

// Clear wishlist
router.delete("/", authMiddleware, wrapAsync(wishlistController.clearWishlist));

module.exports = router;
