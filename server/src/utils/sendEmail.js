const nodemailer = require("nodemailer");
const { getTransporter } = require("../config/email");

// Sends an email via the Ethereal transport and logs a preview URL
// to the console - this is how you actually view the email content
// during local development, since Ethereal never delivers to a real
// inbox.
async function sendEmail({ to, subject, html }) {
  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from: '"Fashion E-Commerce Platform" <no-reply@fashionco.test>',
    to,
    subject,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log(`Email sent: "${subject}" to ${to}`);
  console.log(`Preview URL: ${previewUrl}`);

  return info;
}

module.exports = sendEmail;