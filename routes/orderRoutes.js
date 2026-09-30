const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const wrapAsync = require("../utils/wrapAsync");

// CREATE ORDER
router.post("/", authMiddleware, wrapAsync(orderController.createOrder));

// GET MY ORDERS
router.get("/", authMiddleware, wrapAsync(orderController.getMyOrders));

// GET MY SINGLE ORDER
router.get("/:id", authMiddleware, wrapAsync(orderController.getMyOrderById));

// CANCEL MY ORDER
router.put(
  "/:id/cancel",
  authMiddleware,
  wrapAsync(orderController.cancelOrder),
);

module.exports = router;
