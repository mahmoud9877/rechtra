const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./config/.env") });
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_PASS;

app.get("/", (req, res) => {
  res.send("✅ Techtra API is working on Vercel!");
});

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });
  const mailOptions = {
    from: email,
    to: gmailUser,
    subject: `Message from ${name}`,
    text: message,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Message sent" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Message failed", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
