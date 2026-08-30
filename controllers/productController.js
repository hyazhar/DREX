const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const ExpressError = require("../utils/ExpressError");

// Create Product
module.exports.createProduct = async (req, res) => {
  const { category } = req.body;
  // Check if the category exists
  const existingCategory = await Category.findById(category);

  if (!existingCategory) {
    throw new ExpressError(404, "Category not found");
  }

  const product = new Product(req.body);

  await product.save();

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
};

// Get All Products
module.exports.getAllProducts = async (req, res) => {
  const products = await Product.find().populate("category");

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};

// Get Single Product
module.exports.getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id).populate("category");

  if (!product) {
    throw new ExpressError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    product,
  });
};

// Update Product
module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  // If user is updating category, check whether it exists
  if (req.body.category) {
    const category = await Category.findById(req.body.category);

    if (!category) {
      throw new ExpressError(404, "Category not found");
    }
  }

  const product = await Product.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate("category");

  if (!product) {
    throw new ExpressError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
};

// Delete Product
module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ExpressError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};