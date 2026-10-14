import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/contact", async (req, res) => {
  console.log("REQUEST RECEIVED", Date.now());

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Please fill in all fields.",
    });
  }

  try {
    // 1. Save message to Supabase
    const { error: dbError } = await supabase
      .from("messages")
      .insert([{ name, email, message }]);

    if (dbError) {
      console.error("Supabase Error:", dbError.message);

      return res.status(500).json({
        success: false,
        error: "Could not save your message.",
      });
    }

    console.log("Data saved to Supabase");

    // 2. Send email to Open Nexus team
    const { data: teamData, error: teamError } =
      await resend.emails.send({
        from: "Open Nexus <onboarding@resend.dev>",
        to: ["shivamk.it.25@nitj.ac.in"],
        replyTo: email,
        subject: "New Contact Message",
        text: `Name: ${name}
Email: ${email}
Message: ${message}`,
      });

    if (teamError) {
      console.error("Team Email Error:", teamError);

      return res.status(500).json({
        success: false,
        error: teamError.message,
      });
    }

    console.log("Team email sent:", teamData.id);

    // 3. Send confirmation email to the visitor
    const { data: userData, error: userError } =
      await resend.emails.send({
        from: "Open Nexus <onboarding@resend.dev>",
        to: [email],
        subject: "We received your message 🚀",
        text: `Hey ${name},

Thanks for contacting Open Nexus!

We received your message:
"${message}"

Our team will get back to you soon.

— Open Nexus`,
      });

    if (userError) {
      console.error("User Email Error:", userError);

      return res.status(500).json({
        success: false,
        error: userError.message,
      });
    }

    console.log("Confirmation email sent:", userData.id);

    return res.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Something went wrong.",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Open Nexus Backend is running 🚀");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});