const Address = require("../models/addressSchema");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");

// ADD ADDRESS
module.exports.addAddress = async (req, res) => {
  const {
    name,
    phone,
    addressLine,
    city,
    state,
    pincode,
    country = "India",
    type = "home",
    isDefault = false,
  } = req.body;

  // Required fields
  if (!name || !phone || !addressLine || !city || !state || !pincode) {
    throw new ExpressError(
      400,
      "Name, phone, addressLine, city, state and pincode are required",
    );
  }

  // Name validation
  if (name.trim().length < 2) {
    throw new ExpressError(400, "Name must be at least 2 characters");
  }

  // Phone validation
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(phone)) {
    throw new ExpressError(400, "Invalid Indian phone number");
  }

  // Pincode validation
  const pincodeRegex = /^\d{6}$/;

  if (!pincodeRegex.test(pincode)) {
    throw new ExpressError(400, "Pincode must be 6 digits");
  }

  // Address type validation
  if (!["home", "office", "other"].includes(type)) {
    throw new ExpressError(400, "Invalid address type");
  }

  // If this is the first address,
  // automatically make it default.
  const addressCount = await Address.countDocuments({
    user: req.user._id,
  });

  let defaultAddress = Boolean(isDefault);

  if (addressCount === 0) {
    defaultAddress = true;
  }

  // If this address becomes default,
  // remove default from previous addresses.
  if (defaultAddress) {
    await Address.updateMany(
      {
        user: req.user._id,
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );
  }

  const address = await Address.create({
    user: req.user._id,
    name: name.trim(),
    phone: phone.trim(),
    addressLine: addressLine.trim(),
    city: city.trim(),
    state: state.trim(),
    pincode: pincode.trim(),
    country: country.trim(),
    type,
    isDefault: defaultAddress,
  });

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address,
  });
};

// GET ALL ADDRESSES
module.exports.getAddresses = async (req, res) => {
  const addresses = await Address.find({
    user: req.user._id,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: addresses.length,
    addresses,
  });
};

// GET SINGLE ADDRESS
module.exports.getAddressById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid address ID");
  }

  const address = await Address.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!address) {
    throw new ExpressError(404, "Address not found");
  }

  res.status(200).json({
    success: true,
    address,
  });
};

// UPDATE ADDRESS
module.exports.updateAddress = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    phone,
    addressLine,
    city,
    state,
    pincode,
    country,
    type,
    isDefault,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid address ID");
  }

  const address = await Address.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!address) {
    throw new ExpressError(404, "Address not found");
  }

  // Name
  if (name !== undefined) {
    if (name.trim().length < 2) {
      throw new ExpressError(400, "Name must be at least 2 characters");
    }

    address.name = name.trim();
  }

  // Phone
  if (phone !== undefined) {
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      throw new ExpressError(400, "Invalid Indian phone number");
    }

    address.phone = phone.trim();
  }

  // Address
  if (addressLine !== undefined) {
    if (addressLine.trim().length < 5) {
      throw new ExpressError(400, "Address must be at least 5 characters");
    }

    address.addressLine = addressLine.trim();
  }

  // City
  if (city !== undefined) {
    address.city = city.trim();
  }

  // State
  if (state !== undefined) {
    address.state = state.trim();
  }

  // Pincode
  if (pincode !== undefined) {
    const pincodeRegex = /^\d{6}$/;

    if (!pincodeRegex.test(pincode)) {
      throw new ExpressError(400, "Pincode must be 6 digits");
    }

    address.pincode = pincode.trim();
  }

  // Country
  if (country !== undefined) {
    address.country = country.trim();
  }

  // Type
  if (type !== undefined) {
    if (!["home", "office", "other"].includes(type)) {
      throw new ExpressError(400, "Invalid address type");
    }

    address.type = type;
  }

  // Make default
  if (isDefault === true) {
    await Address.updateMany(
      {
        user: req.user._id,
        _id: { $ne: id },
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );

    address.isDefault = true;
  }

  await address.save();

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address,
  });
};

// DELETE ADDRESS
module.exports.deleteAddress = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid address ID");
  }

  const address = await Address.findOne({
    _id: id,
    user: req.user._id,
  });

  if (!address) {
    throw new ExpressError(404, "Address not found");
  }

  const wasDefault = address.isDefault;

  await Address.findByIdAndDelete(id);

  // If deleted address was default,
  // make another address default.
  if (wasDefault) {
    const nextAddress = await Address.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
};
