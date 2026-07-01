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