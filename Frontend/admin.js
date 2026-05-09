console.log("ADMIN PANEL CONNECTED 🚀");

const adminsupabase = window.supabase.createClient(
  "https://jfglptsrjlkedvneehbj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZ2xwdHNyamxrZWR2bmVlaGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Mzc0MjksImV4cCI6MjA5MzAxMzQyOX0.4c3OCZCAtkMem_IdoEnkdrlIxCtG-ZHAjRalTUNpgR0"
);

// 🔒 CHECK USER SESSION
async function checkUser() {

    const { data, error } = await adminsupabase.auth.getUser();

    if (error || !data.user) {

        alert("Please login first 😎");

        window.location.href = "login.html";

        return;
    }

    console.log("✅ Logged In User:", data.user.email);

    // AFTER AUTH SUCCESS
    loadMessages();
}

checkUser();


// 📦 LOAD MESSAGES
async function loadMessages() {

    const { data, error } = await adminsupabase
    .from("messages")
    .select("*")
    .order("id", { ascending: false });

    if (error) {

        console.error(error);

        alert("Failed to load messages");

        return;
    }

    const container = document.getElementById("messages");

    container.innerHTML = "";

    data.forEach((msg) => {

        const div = document.createElement("div");

        div.classList.add("message-card");

        div.innerHTML = `

            <h3>${msg.name}</h3>

            <p class="email">${msg.email}</p>

            <p>${msg.message}</p>

            <p style="color:gray; font-size:13px;">
                ${msg.created_at || ""}
            </p>

        `;

        container.appendChild(div);
    });
}


// 🚪 LOGOUT
window.logout = async function () {

    await adminsupabase.auth.signOut();

    alert("Logged out 👋");

    window.location.href = "login.html";
};