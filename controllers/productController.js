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
  const {category,subCategory,minPrice,maxPrice,search,sort,page = 1,limit = 10,} = req.query;

  const filter = {};

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Subcategory filter
  if (subCategory) {
    filter.subCategory = subCategory;
  }

  // Price filter
  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { subCategory: { $regex: search, $options: "i" } },
    ];
  }

  let sortOption = {};

  if (sort === "price_asc") {
    sortOption.price = 1;
  } else if (sort === "price_desc") {
    sortOption.price = -1;
  } else if (sort === "newest") {
    sortOption.createdAt = -1;
  } else if (sort === "oldest") {
    sortOption.createdAt = 1;
  }
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.max(Number(limit), 1);

  const skip = (pageNumber - 1) * limitNumber;

  const products = await Product.find(filter)
    .populate("category")
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);

  // Total matching products
  const totalProducts = await Product.countDocuments(filter);

  const totalPages = Math.ceil(totalProducts / limitNumber);

  res.status(200).json({
    success: true,

    count: products.length,

    totalProducts,

    currentPage: pageNumber,

    totalPages,

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