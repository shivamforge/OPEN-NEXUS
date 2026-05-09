console.log("LOGIN JS CONNECTED 🚀");

const authsupabase = window.supabase.createClient(
  "https://jfglptsrjlkedvneehbj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZ2xwdHNyamxrZWR2bmVlaGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0Mzc0MjksImV4cCI6MjA5MzAxMzQyOX0.4c3OCZCAtkMem_IdoEnkdrlIxCtG-ZHAjRalTUNpgR0"
);

let loading = false;


// ✅ SIGNUP
window.signup = async function () {

    if (loading) return;

    loading = true;

    console.log("SIGNUP STARTED 🔥");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const { data, error } = await authsupabase.auth.signUp({
            email,
            password,
        });

        if (error) {

            alert(error.message);

        } else {

            alert("Signup success 🚀");
        }

    } catch (err) {

        console.log(err);

    }

    loading = false;
};


// ✅ LOGIN
window.login = async function () {

    if (loading) return;

    loading = true;

    console.log("LOGIN STARTED 🔥");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const { data, error } =
        await authsupabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {

            alert(error.message);

        } else {

            alert("Login success 🚀");

            window.location.href = "admin.html";
        }

    } catch (err) {

        console.log(err);

    }

    loading = false;
};