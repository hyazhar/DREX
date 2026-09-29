const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authMiddleware = require("../middleware/authMiddleware");
const wrapAsync = require("../utils/wrapAsync");

// GET ALL ADDRESSES
router.get("/", authMiddleware, wrapAsync(addressController.getAddresses));

// ADD ADDRESS
router.post("/", authMiddleware, wrapAsync(addressController.addAddress));

// GET SINGLE ADDRESS
router.get("/:id", authMiddleware, wrapAsync(addressController.getAddressById));

// UPDATE ADDRESS
router.put("/:id", authMiddleware, wrapAsync(addressController.updateAddress));

// DELETE ADDRESS
router.delete("/:id",authMiddleware,wrapAsync(addressController.deleteAddress));

module.exports = router;
