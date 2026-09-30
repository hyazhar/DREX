const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const wrapAsync = require("../utils/wrapAsync");

// GET ALL ORDERS
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  wrapAsync(orderController.getAllOrders),
);

// GET SINGLE ORDER
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  wrapAsync(orderController.getAdminOrderById),
);

// UPDATE ORDER STATUS
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  wrapAsync(orderController.updateOrderStatus),
);

module.exports = router;
