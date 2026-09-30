const mongoose = require("mongoose");

// ORDER ITEM
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Snapshot of product name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Snapshot of product price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Snapshot of product image
    image: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// SHIPPING ADDRESS SNAPSHOT
const shippingAddressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    addressLine: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["home", "office", "other"],
      default: "home",
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    // OWNER OF ORDER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // PRODUCTS
    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: function (items) {
          return items.length > 0;
        },
        message: "Order must contain at least one product",
      },
    },

    // SHIPPING ADDRESS SNAPSHOT
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    // FINAL ORDER TOTAL
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ORDER STATUS
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
      index: true,
    },

    // PAYMENT STATUS
    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    // PAYMENT METHOD
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);