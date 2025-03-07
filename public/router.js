import { loadActivities } from "./modules/activities.js";
import { loadMyActivities } from "./modules/myActivities.js";
import { login } from "./modules/login.js";
import { register } from "./modules/register.js";

const routes = {
  "/activities": loadActivities,
  "/my-activities": loadMyActivities,
  "/login": login,
  "/register": register,
};

export function handleRoute() {
  const path = window.location.pathname;

  const route = routes[path];

  if (route) {
    const content = document.getElementById("content");
    route(content);
  } else {
    document.getElementById("content").innerHTML = "<h2>Page Not Found</h2>";
  }
}

export function navigateTo(path) {
  if (window.location.pathname !== path) {
    window.history.pushState({}, path, window.location.origin + path);
    handleRoute();
  }
}

window.addEventListener("popstate", handleRoute);
