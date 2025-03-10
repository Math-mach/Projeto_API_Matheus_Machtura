import { handleRoute, navigateTo } from "./router.js";

document.getElementById("activities-link").addEventListener("click", () => {
  navigateTo("/activities");
});

document.getElementById("my-activities-link").addEventListener("click", () => {
  navigateTo("/my-activities");
});

document.getElementById("login-link").addEventListener("click", () => {
  navigateTo("/login");
});

document.getElementById("register-link").addEventListener("click", () => {
  navigateTo("/register");
});

window.addEventListener("load", () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  document.getElementById("activities-link").style.display = "none";
  document.getElementById("my-activities-link").style.display = "none";
  navigateTo("/login");
});
