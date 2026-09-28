const Wishlist = require("../models/wishlistSchema");
const Product = require("../models/productSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({
    user: req.user._id,
  }).populate("products");

  if (!wishlist) {
    wishlist = {
      user: req.user._id,
      products: [],
    };
  }
  res.status(200).json({
    success: true,
    wishlist,
  });
};

module.exports.addToWishlist = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ExpressError(400, "Product ID is required");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ExpressError(404, "Product not found");
  }
  let wishlist = await Wishlist.findOne({
    user: req.user._id,
  });
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [productId],
    });
  } else {
    const alreadyExists = wishlist.products.some(
      (product) => product.toString() === productId,
    );
    if (alreadyExists) {
      throw new ExpressError(409, "Product is already in wishlist");
    }
    wishlist.products.push(productId);
    await wishlist.save();
  }
  await wishlist.populate("products");
  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
    wishlist,
  });
};

module.exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({
    user: req.user._id,
  });

  if (!wishlist) {
    throw new ExpressError(404, "Wishlist not found");
  }

  const productExists = wishlist.products.some(
    (product) => product.toString() === productId,
  );

  if (!productExists) {
    throw new ExpressError(404, "Product is not in wishlist");
  }

  wishlist.products = wishlist.products.filter(
    (product) => product.toString() !== productId,
  );

  await wishlist.save();

  await wishlist.populate("products");

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishlist,
  });
};

module.exports.clearWishlist = async (req, res) => {
  const wishlist = await Wishlist.findOne({
    user: req.user._id,
  });

  if (!wishlist) {
    throw new ExpressError(404, "Wishlist not found");
  }

  wishlist.products = [];

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: "Wishlist cleared successfully",
    wishlist,
  });
};
