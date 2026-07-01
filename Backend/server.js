import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();

app.use(cors());
app.use(express.json());

// Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

app.post("/contact", async (req, res) => {
  console.log("REQUEST RECEIVED", Date.now());

  const { name, email, message } = req.body;

  try {
    console.log("👉 USER EMAIL:", email);

    // Save to Supabase
    const { error } = await supabase
      .from("messages")
      .insert([{ name, email, message }]);

    if (error) {
      console.error("❌ Supabase Error:", error);
    } else {
      console.log("✅ Data saved to DB");
    }

    // Mail to Team
    console.log("🔥 Step 1: sending to TEAM");

    await transporter.sendMail({
      from: "Open Nexus <shivamraj2160@gmail.com>",
      to: "sr3392780@gmail.com",
      replyTo: email,
      subject: "New Contact Message",
      text: `Name: ${name}
Email: ${email}
Message: ${message}`,
    });

    console.log("✅ Team mail sent");

    // Auto mail to User
    console.log("🔥 Step 2: sending to USER");

    await transporter.sendMail({
      from: "Open Nexus <shivamraj2160@gmail.com>",
      to: email,
      subject: "We received your message 🚀",
      text: `Hey ${name},

Thanks for contacting Open Nexus!

We received your message:
"${message}"

Our team will get back to you soon.

— Open Nexus`,
    });

    console.log("✅ User mail sent");

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 8000;

transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP VERIFY ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});