console.log("JS CONNECTED 🚀");

const contactsupabase = window.supabase.createClient(
  "https://jfglptsrjlkedvneehbj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZ2xwdHNyamxrZWR2bmVlaGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Mzc0MjksImV4cCI6MjA5MzAxMzQyOX0.4c3OCZCAtkMem_IdoEnkdrlIxCtG-ZHAjRalTUNpgR0"
);

const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    console.log("FORM SUBMITTED 🔥");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const button = form.querySelector("button");

    button.disabled = true;
    button.innerText = "Sending...";

    try {

        // SAVE TO SUPABASE
        const { error } = await contactsupabase
        .from("messages")
        .insert([{ name, email, message }]);

        if (error) {
            console.log("SUPABASE ERROR:", error);
            alert("Database Error");
            return;
        }

        console.log("✅ Saved to Supabase");

        // SEND TO BACKEND
        const res = await fetch("http://127.0.0.1:8000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        const data = await res.json();

        console.log("✅ Backend Response:", data);

        alert("Message Sent Successfully ✅");

        form.reset();

    } catch(err){

        console.log("ERROR:", err);

        alert("Something went wrong ❌");

    } finally {

        button.disabled = false;
        button.innerText = "Send Message";
    }
});