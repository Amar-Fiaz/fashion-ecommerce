const cod = require("./payments/cod");
const bankTransfer = require("./payments/bankTransfer");
const mockGateway = require("./payments/mockGateway");

const methods = {
  cod,
  bank_transfer: bankTransfer,
  mock_gateway: mockGateway,
};

// Central dispatcher - callers never talk to a specific payment
// method's module directly, only through this interface. Adding a
// real gateway later means adding one more entry here, not touching
// order creation or checkout logic.
async function initiatePayment(methodKey, order) {
  const method = methods[methodKey];
  if (!method) {
    const error = new Error(`Unsupported payment method: ${methodKey}`);
    error.statusCode = 400;
    throw error;
  }
  return method.initiate(order);
}

async function verifyPayment(methodKey, payload) {
  const method = methods[methodKey];
  if (!method || !method.verify) {
    const error = new Error(`Payment method ${methodKey} does not support verification`);
    error.statusCode = 400;
    throw error;
  }
  return method.verify(payload);
}

module.exports = { initiatePayment, verifyPayment };