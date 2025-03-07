import { navigateTo } from "../router.js";

export function register(content) {
  content.innerHTML = `
    <h2>Register</h2>
    <form id="registerForm">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required />
      <br />
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required />
      <br />
      <label for="confirmPassword">Confirm Password:</label>
      <input type="password" id="confirmPassword" name="confirmPassword" required />
      <br />
      <button type="submit">Register</button>
    </form>
    <p id="errorMessage" style="color: red; display: none;"></p>
  `;

  const registerForm = document.getElementById("registerForm");
  const errorMessage = document.getElementById("errorMessage");

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    errorMessage.style.display = "none";

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorMessage.style.display = "block";
      errorMessage.innerHTML = "O e-mail fornecido é inválido.";
      return;
    }

    // Validação da senha
    const passwordMinLength = 8;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (password.length < passwordMinLength) {
      errorMessage.style.display = "block";
      errorMessage.innerHTML = `A senha deve ter no mínimo ${passwordMinLength} caracteres.`;
      return;
    }

    if (!passwordRegex.test(password)) {
      errorMessage.style.display = "block";
      errorMessage.innerHTML =
        "A senha deve conter pelo menos uma letra, um número e um caractere especial.";
      return;
    }

    // Verificar se a senha e a confirmação de senha são iguais
    if (password !== confirmPassword) {
      errorMessage.style.display = "block";
      errorMessage.innerHTML = "As senhas não coincidem.";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        alert("Registro feito com sucesso, vá logar");
      } else {
        const errorData = await response.json();
        errorMessage.style.display = "block";
        errorMessage.innerHTML =
          errorData.error || "Falha ao registrar, tente novamente.";
      }
    } catch (error) {
      console.error("Erro ao fazer registro:", error);
      errorMessage.style.display = "block";
      errorMessage.innerHTML =
        "Erro ao conectar com o servidor. Tente novamente mais tarde.";
    }
  });
}
