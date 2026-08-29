const User = require("../models/User");
const { toSafeUser } = require("./auth.service");

async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return toSafeUser(user);
}

async function updateProfile(userId, { name }) {
  const user = await User.findByIdAndUpdate(userId, { name }, { new: true });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return toSafeUser(user);
}

async function getAddresses(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user.addresses;
}

// If the new/updated address is marked as default, unsets isDefault
// on all other addresses first, so exactly one address is ever
// marked default at a time.
async function addAddress(userId, addressData) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (addressData.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  user.addresses.push(addressData);
  await user.save();
  return user.addresses;
}

async function updateAddress(userId, addressId, addressData) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  if (addressData.isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  Object.assign(address, addressData);
  await user.save();
  return user.addresses;
}

async function deleteAddress(userId, addressId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const address = user.addresses.id(addressId);
  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  address.deleteOne();
  await user.save();
  return user.addresses;
}

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};