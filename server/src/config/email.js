const nodemailer = require("nodemailer");

// Development email transport via Ethereal (nodemailer's built-in
// fake SMTP testing service). Emails never actually deliver anywhere
// - each send generates a preview URL logged to the console, where
// the email content can be viewed. No real credentials or account
// setup required. A real provider is a deliberate future decision
// (e.g. at deployment), not made here - see ARCHITECTURE.md Section 10
// for the same deferred-decision pattern applied to hosting.

let transporterPromise = null;

function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = nodemailer.createTestAccount().then((testAccount) => {
      return nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    });
  }
  return transporterPromise;
}

module.exports = { getTransporter };