const SUPABASE_URL = "https://ewastpsqndqjtiuaagwy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3YXN0cHNxbmRxanRpdWFhZ3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNTM4ODIsImV4cCI6MjA5NjkyOTg4Mn0.BVfU3vmJeA3xpg_jMDdunqlVdDXkxIFPWu5BPdrjhTQ";

// IMPORTANT: only ONE client, never redeclare supabase
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// SIGNUP
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupEmail.value;
  const password = signupPassword.value;

  const { error } = await client.auth.signUp({
    email,
    password
  });

  signupResult.innerText = error ? error.message : "Signup success! Check email.";
});

// LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    loginResult.innerText = error.message;
  } else {
    window.location.href = "dashboard.html";
  }
});
