const Category = require("../models/categorySchema");
const ExpressError = require("../utils/ExpressError");

// Create Category
module.exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  const category = new Category({
    name,
    description,
  });

  await category.save();

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
};

// Get All Categories
module.exports.getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    success: true,
    count: categories.length,
    categories,
  });
};

// Get Single Category
module.exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    throw new ExpressError(404, "Category not found");
  }
  res.status(200).json({
    success: true,
    category,
  });
};
// Update Category
module.exports.updateCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!category) {
    throw new ExpressError(404, "Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
};

// Delete Category
module.exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new ExpressError(404, "Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};