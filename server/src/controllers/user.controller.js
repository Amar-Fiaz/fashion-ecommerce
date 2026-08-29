const userService = require("../services/user.service");

async function getProfile(req, res, next) {
  try {
    const user = await userService.getProfile(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

async function getAddresses(req, res, next) {
  try {
    const addresses = await userService.getAddresses(req.user.id);
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
}

async function addAddress(req, res, next) {
  try {
    const addresses = await userService.addAddress(req.user.id, req.body);
    res.status(201).json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
}

async function updateAddress(req, res, next) {
  try {
    const addresses = await userService.updateAddress(
      req.user.id,
      req.params.addressId,
      req.body
    );
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const addresses = await userService.deleteAddress(req.user.id, req.params.addressId);
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};