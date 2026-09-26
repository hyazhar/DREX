const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new ExpressError(400, "Product ID is required");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ExpressError(400, "Quantity must be a positive integer");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ExpressError(404, "Product not found");
  }

  let cart = await Cart.findOne({
    user: req.user._id,
  });

  // Create cart if user doesn't have one
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [
        {
          product: productId,
          quantity,
        },
      ],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();
  }

  await cart.populate({
    path: "items.product",
    select: "-__v",
  });

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart,
  });
};

module.exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "items.product",
    select: "-__v",
  });

  // If cart doesn't exist
  if (!cart) {
    cart = {
      user: req.user._id,
      items: [],
    };
  }

  res.status(200).json({
    success: true,
    cart,
  });
};

module.exports.updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ExpressError(400, "Quantity must be a positive integer");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ExpressError(404, "Product not found");
  }

  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    throw new ExpressError(404, "Cart not found");
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    throw new ExpressError(404, "Product is not in the cart");
  }

  item.quantity = quantity;

  await cart.save();

  await cart.populate({
    path: "items.product",
    select: "-__v",
  });

  res.status(200).json({
    success: true,
    message: "Cart quantity updated",
    cart,
  });
};

module.exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    throw new ExpressError(404, "Cart not found");
  }

  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId,
  );

  if (!itemExists) {
    throw new ExpressError(404, "Product is not in the cart");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  await cart.populate({
    path: "items.product",
    select: "-__v",
  });

  res.status(200).json({
    success: true,
    message: "Product removed from cart",
    cart,
  });
};

module.exports.clearCart = async (req, res) => {
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    throw new ExpressError(404, "Cart not found");
  }

  cart.items = [];

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    cart,
  });
};
