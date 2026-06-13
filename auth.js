const supabaseUrl = "https://ewastpsqndqjtiuaagwy.supabase.co";
const supabaseKey = "sb_publishable_H4cWNsOmEAPu1ymPdhFxSw_YjRgoWDT";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Signup
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  const { error } = await supabase.auth.signUp({ email, password });

  document.getElementById("signupResult").innerText =
    error ? error.message : "Signup successful! Check email.";
});

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("loginResult").innerText = error.message;
  } else {
    window.location.href = "dashboard.html";
  }
});
