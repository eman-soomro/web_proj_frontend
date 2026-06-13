<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trend Forecast - Auth</title>

  <link rel="stylesheet" href="style.css">

  <!-- Supabase CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>

<body class="auth-body">

  <div class="auth-card">

    <h1>📈 Trend Forecast</h1>

    <img src="login-illustration.png" class="hero-img" alt="hero">

    <h2>Signup</h2>

    <form id="signupForm">
      <input type="email" id="signupEmail" placeholder="Email" required>
      <input type="password" id="signupPassword" placeholder="Password" required>
      <button type="submit"><i class="fa fa-user-plus"></i> Signup</button>
    </form>

    <div id="signupResult"></div>

    <div class="divider"><span>OR</span></div>

    <h2>Login</h2>

    <form id="loginForm">
      <input type="email" id="email" placeholder="Email" required>
      <input type="password" id="password" placeholder="Password" required>
      <button type="submit"><i class="fa fa-sign-in"></i> Login</button>
    </form>

    <div id="loginResult"></div>

  </div>

  <script src="auth.js"></script>
</body>
</html>
