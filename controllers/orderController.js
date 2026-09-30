const mongoose = require("mongoose");
const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");
const Address = require("../models/addressSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createOrder = async (req, res) => {
  const { addressId, paymentMethod = "COD" } = req.body;

  if (!addressId) {
    throw new ExpressError(400, "Address ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ExpressError(400, "Invalid address ID");
  }

  if (!["COD", "ONLINE"].includes(paymentMethod)) {
    throw new ExpressError(400, "Invalid payment method");
  }

  // Start MongoDB transaction
  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      const address = await Address.findOne({
        _id: addressId,
        user: req.user._id,
      }).session(session);

      if (!address) {
        throw new ExpressError(404, "Address not found");
      }

      const cart = await Cart.findOne({
        user: req.user._id,
      })
        .populate("items.product")
        .session(session);

      if (!cart || cart.items.length === 0) {
        throw new ExpressError(400, "Cart is empty");
      }

      const orderItems = cart.items.map((item) => {
        if (!item.product) {
          throw new ExpressError(
            400,
            "One or more products in cart no longer exist",
          );
        }

        return {
          product: item.product._id,

          // Snapshot
          name: item.product.name,

          // Current DB price
          price: item.product.price,

          quantity: item.quantity,

          // Support different image structures
          image: item.product.image?.url || item.product.image || "",
        };
      });

      const totalAmount = orderItems.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      const shippingAddress = {
        name: address.name,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        type: address.type,
      };
      const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        totalAmount,
        paymentMethod,
      });

      await order.save({ session });

      createdOrder = order;
      cart.items = [];

      await cart.save({ session });
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: createdOrder,
    });
  } finally {
    await session.endSession();
  }
};

module.exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
};

module.exports.getMyOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid order ID");
  }

  const order = await Order.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!order) {
    throw new ExpressError(404, "Order not found");
  }

  res.status(200).json({
    success: true,
    order,
  });
};

module.exports.cancelOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid order ID");
  }

  const order = await Order.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!order) {
    throw new ExpressError(404, "Order not found");
  }

  // Already cancelled
  if (order.status === "Cancelled") {
    throw new ExpressError(400, "Order is already cancelled");
  }

  // Cannot cancel after shipping
  const nonCancellableStatuses = ["Shipped", "Out for Delivery", "Delivered"];

  if (nonCancellableStatuses.includes(order.status)) {
    throw new ExpressError(400, "Order cannot be cancelled at this stage");
  }

  order.status = "Cancelled";

  if (order.paymentStatus === "Paid") {
    order.paymentStatus = "Refunded";
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
};

module.exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
};

module.exports.getAdminOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid order ID");
  }

  const order = await Order.findById(id).populate("user", "name email");

  if (!order) {
    throw new ExpressError(404, "Order not found");
  }

  res.status(200).json({
    success: true,
    order,
  });
};

module.exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid order ID");
  }

  const allowedStatuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  if (!status) {
    throw new ExpressError(400, "Order status is required");
  }

  if (!allowedStatuses.includes(status)) {
    throw new ExpressError(400, "Invalid order status");
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new ExpressError(404, "Order not found");
  }

  if (order.status === "Delivered") {
    throw new ExpressError(400, "Delivered order status cannot be changed");
  }

  order.status = status;

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
};
