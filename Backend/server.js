import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://jfglptsrjlkedvneehbj.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZ2xwdHNyamxrZWR2bmVlaGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Mzc0MjksImV4cCI6MjA5MzAxMzQyOX0.4c3OCZCAtkMem_IdoEnkdrlIxCtG-ZHAjRalTUNpgR0")

const app = express();

app.use(cors());
app.use(express.json());


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "shivamraj2160@gmail.com",        // 👈 your email
        pass: "wnsxntuvwhqjrbcu"               // 👈 app password
    }
});
app.post("/contact", async (req, res) => {
    console.log("REQUEST RECEIVED", Date.now());
    const { name, email, message } = req.body;

    try {
console.log("👉 USER EMAIL:", email);

// 🔥 1. SAVE TO SUPABASE
        const { data, error } = await supabase
            .from("messages")
            .insert([{ name, email, message }]);
            console.log("Inserted once");

        if (error) {
            console.error("❌ Supabase Error:", error);
        } else {
            console.log("✅ Data saved to DB");
        }

// 🔥 STEP 1: Send to TEAM
console.log("🔥 Step 1: sending to TEAM");

await transporter.sendMail({
    from: "Open Nexus <shivamraj2160@gmail.com>",
    to: "sr3392780@gmail.com",
    replyTo: email,
    subject: "New Contact Message",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
});

console.log("✅ Team mail sent");

// 🔥 STEP 2: Send AUTO MAIL to USER
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

— Open Nexus`
});

console.log("✅ User mail sent");

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

app.listen(8000, () => {
    console.log("🚀 Server running at http://localhost:8000");
});

