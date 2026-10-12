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
    const res = await fetch(
        "https://open-nexus-backend.onrender.com/contact",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        }
    );

    const data = await res.json();

    console.log("Backend HTTP Status:", res.status);
    console.log("Backend Response:", data);

    if (!res.ok || !data.success) {
        throw new Error(data.error || `HTTP Error: ${res.status}`);
    }

    alert("Message Sent Successfully ✅");
    form.reset();

} catch (err) {
    console.error("Contact Form Error:", err);

    alert(`Message could not be sent ❌\n${err.message}`);

} finally {
    button.disabled = false;
    button.innerText = "Send Message";
}
});