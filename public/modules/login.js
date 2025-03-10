import { navigateTo } from "../router.js";

export function login(content) {
  content.innerHTML = `
    <h2>Login</h2>
    <form id="loginForm">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <br />
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required />
      <br />
      <button type="submit">Login</button>
    </form>
    <p id="errorMessage" style="color: red; display: none;">Invalid credentials, please try again.</p>
  `;

  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    errorMessage.style.display = "none";

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userRole", data.userRole);
        navigateTo("/activities");
        document.getElementById("activities-link").style.display = "inline";
        document.getElementById("my-activities-link").style.display = "inline";
        document.getElementById("login-link").style.display = "none";
        document.getElementById("register-link").style.display = "none";
      } else {
        const errorData = await response.json();
        errorMessage.style.display = "block";
        errorMessage.innerHTML =
          errorData.error || "Falha no login, tente novamente.";
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      errorMessage.style.display = "block";
      errorMessage.innerHTML =
        "Erro ao conectar com o servidor. Tente novamente mais tarde.";
    }
  });
}
